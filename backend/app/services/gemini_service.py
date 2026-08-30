import os
import json
import httpx
from typing import Dict, Any, Optional

from app.core.config import settings

GEMINI_SYSTEM_INSTRUCTION = """
You are AgriGuard-AI's Lead City Food-Resilience Analyst for Pune, Maharashtra, India.
Your role is to explain calculated food-system risks, justify agricultural recovery priorities, and provide operational decision support for urban emergency planners.

STRICT OPERATIONAL RULES:
1. Treat all provided AgriGuard system calculations (scores, loss tons, percentages, priority levels) as immutable source of truth.
2. NEVER invent, hallucinate, or alter any numerical figures or statistics.
3. Clearly distinguish calculated system data from your strategic recommendations.
4. Always explicitly state that data represents an "illustrative prototype methodology demonstration".
5. NEVER claim legal tenancy, land ownership, or official compensation verification. Always note that AI-assisted evidence requires administrative verification.
6. Provide structured, concise, professional operational advice tailored to city resilience coordinators.
"""

class GeminiService:

    @staticmethod
    def get_api_key() -> Optional[str]:
        return os.environ.get("GEMINI_API_KEY") or settings.GEMINI_API_KEY

    @classmethod
    def generate_analysis(
        cls,
        user_question: str,
        system_context: Dict[str, Any],
        language: str = "en",
        history: Optional[list] = None
    ) -> Dict[str, Any]:
        api_key = cls.get_api_key()
        
        if not api_key or api_key == "your_gemini_api_key_here":
            return {
                "success": False,
                "error": "Gemini API key is not configured. Set GEMINI_API_KEY in server environment.",
                "fallback_analysis": cls._generate_rule_based_fallback(user_question, system_context, language)
            }

        lang_instruction = "Respond in English."
        if language == "hi":
            lang_instruction = "Respond in Hindi (हिन्दी). Keep Parcel IDs (e.g. PARCEL-PNE-037), Market IDs/names, numbers, crop technical codes, and strict numerical values exact and unchanged."
        elif language == "mr":
            lang_instruction = "Respond in Marathi (मराठी). Keep Parcel IDs (e.g. PARCEL-PNE-037), Market IDs/names, numbers, crop technical codes, and strict numerical values exact and unchanged."

        conversation_str = ""
        if history and len(history) > 0:
            formatted_turns = []
            for item in history[-6:]:  # Keep recent context
                role = "User" if item.get("role") == "user" else "Assistant"
                formatted_turns.append(f"{role}: {item.get('content')}")
            conversation_str = "Recent Conversation History:\n" + "\n".join(formatted_turns) + "\n\n"

        prompt = f"""
Current AgriGuard System State Context (Pune Food Resilience Platform):
{json.dumps(system_context, indent=2)}

{conversation_str}Language Preference: {lang_instruction}

User Question:
"{user_question}"

Please analyze the question strictly using the provided context and system instructions. Return your response in JSON format with keys:
- "summary": short 1-2 sentence overview
- "reasoning": detailed explanation of underlying factors
- "recommended_actions": list of 3 actionable priority steps
- "caveats": mandatory disclaimer about prototype data & administrative verification
"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "systemInstruction": {
                "parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]
            },
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        try:
            with httpx.Client(timeout=20.0) as client:
                res = client.post(url, json=payload, headers=headers)
                if res.status_code != 200:
                    return {
                        "success": False,
                        "error": f"Gemini API returned status code {res.status_code}",
                        "fallback_analysis": cls._generate_rule_based_fallback(user_question, system_context)
                    }

                data = res.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed_json = json.loads(raw_text)

                return {
                    "success": True,
                    "analysis": parsed_json
                }

        except Exception as err:
            return {
                "success": False,
                "error": f"Gemini connection failure: {str(err)}",
                "fallback_analysis": cls._generate_rule_based_fallback(user_question, system_context)
            }

    @staticmethod
    def _generate_rule_based_fallback(question: str, context: Dict[str, Any], language: str = "en") -> Dict[str, Any]:
        """Provides deterministic fallback when Gemini API key is unconfigured or unreachable."""
        active_disaster = context.get("active_disaster")
        risk = context.get("city_food_supply_risk")
        entity = context.get("inspected_entity")

        if language == "hi":
            if not active_disaster:
                return {
                    "summary": "AgriGuard सामान्य परिस्थितियों में काम कर रहा है।",
                    "reasoning": "कोई सक्रिय बाढ़ परिदृश्य सिम्युलेटेड नहीं है। पुणे के सभी कृषि क्षेत्र और थोक बाजार सामान्य आपूर्ति की रिपोर्ट करते हैं।",
                    "recommended_actions": [
                        "नियंत्रक से एक बाढ़ आपदा परिदृश्य चुनें।",
                        "स्थानिक प्रभाव का विश्लेषण करने के लिए जलभराव का अनुकरण करें।",
                        "शहर की खाद्य आपूर्ति संवेदनशीलता का मूल्यांकन करने के लिए जोखिम विश्लेषण चलाएं।"
                    ],
                    "caveats": "सांकेतिक प्रोटोटाइप डेटासेट — आधिकारिक रिकॉर्ड नहीं।"
                }
            risk_score = risk.get("overall_risk_score", 0.0) if risk else "N/A"
            risk_lvl = risk.get("risk_level", "NORMAL") if risk else "NORMAL"
            prod_loss = risk.get("affected_production_loss_tons", 0.0) if risk else 0.0
            return {
                "summary": f"सक्रिय बाढ़ परिदृश्य '{active_disaster.get('event_name')}' ने {risk_score}/100 ({risk_lvl}) का खाद्य जोखिम उत्पन्न किया।",
                "reasoning": f"अनुमानित फसल उत्पादन हानि {active_disaster.get('affected_parcels_count')} कृषि पार्सल में {prod_loss} मीट्रिक टन है।",
                "recommended_actions": [
                    "आपातकालीन जल निकासी और पुनर्प्राप्ति सहायता के लिए शीर्ष महत्वपूर्ण पार्सल को प्राथमिकता दें।",
                    "प्रभावित उपज श्रेणियों के लिए वैकल्पिक थोक आपूर्ति लाइनें स्थापित करें।",
                    "उच्च प्रमाण वाले खेती वाले क्षेत्रों का प्रशासनिक सत्यापन करें।"
                ],
                "caveats": "सांकेतिक प्रोटोटाइप आपदा परिदृश्य और अनुमान — पद्धति प्रदर्शन।"
            }

        if language == "mr":
            if not active_disaster:
                return {
                    "summary": "AgriGuard सामान्य स्थितीत कार्यरत आहे.",
                    "reasoning": "कोणतीही सक्रिय पूर परिस्थिती नाही. पुण्यातील सर्व शेती क्षेत्र आणि घाऊक बाजारपेठा सामान्य पुरवठ्याची नोंद करतात.",
                    "recommended_actions": [
                        "नियंत्रकामधून पूर आपत्ती निवडा.",
                        "स्थानिक प्रभावाचे विश्लेषण करण्यासाठी पूर परिस्थितीचे सिम्युलेशन करा.",
                        "शहर पुरवठा धोक्याचे मूल्यमापन करण्यासाठी अन्न धोका विश्लेषण चालवा."
                    ],
                    "caveats": "प्रारूप डेटासेट — अधिकृत नोंदी नाहीत."
                }
            risk_score = risk.get("overall_risk_score", 0.0) if risk else "N/A"
            risk_lvl = risk.get("risk_level", "NORMAL") if risk else "NORMAL"
            prod_loss = risk.get("affected_production_loss_tons", 0.0) if risk else 0.0
            return {
                "summary": f"सक्रिय पूर परिस्थिती '{active_disaster.get('event_name')}' मुळे शहरातील अन्न पुरवठा धोका {risk_score}/100 ({risk_lvl}) निर्माण झाला.",
                "reasoning": f"अंदाजे पीक उत्पादन नुकसान {active_disaster.get('affected_parcels_count')} कृषी पार्सलमध्ये {prod_loss} मेट्रिक टन आहे.",
                "recommended_actions": [
                    "तातडीच्या पाण्याचा निचरा करण्यासाठी आणि पुनर्रचना सहाय्यासाठी सर्वोच्च पार्सलला प्राधान्य द्या.",
                    "प्रभावित उत्पादनांसाठी पर्यायी घाऊक पुरवठा मार्ग स्थापित करा.",
                    "उच्च पुरावा असलेल्या लागवड क्षेत्रांचे प्रशासकीय पडताळणी करा."
                ],
                "caveats": "प्रारूप आपत्ती परिस्थिती आणि अंदाज — प्रात्यक्षिक."
            }

        if not active_disaster:
            return {
                "summary": "AgriGuard is operating in baseline normal conditions.",
                "reasoning": "No active flood scenario is simulated. All Pune peri-urban agricultural production and wholesale markets report normal supply metrics.",
                "recommended_actions": [
                    "Select a flood disaster scenario from the controller.",
                    "Simulate flood inundation to analyze spatial impact.",
                    "Run food risk analysis to evaluate city supply vulnerability."
                ],
                "caveats": "Illustrative prototype dataset — not official cadastral or weather forecasts."
            }

        risk_score = risk.get("overall_risk_score", 0.0) if risk else "N/A"
        risk_lvl = risk.get("risk_level", "NORMAL") if risk else "NORMAL"
        prod_loss = risk.get("affected_production_loss_tons", 0.0) if risk else 0.0

        if entity and entity.get("type") == "agricultural_parcel":
            p_id = entity.get("parcel_id")
            crop = entity.get("crop_type")
            p_rec = entity.get("recovery_priority", {})
            return {
                "summary": f"Parcel {p_id} ({crop}) is rated {p_rec.get('priority_level', 'HIGH')} priority with a score of {p_rec.get('priority_score', 0)}/100.",
                "reasoning": f"This farm produces {crop} and faces significant flood inundation. It has high cultivation evidence and strong linkage to Pune wholesale markets.",
                "recommended_actions": [
                    "Conduct field administrative verification for crop loss.",
                    "Prioritize rapid drainage and soil recovery assistance.",
                    "Coordinate alternative regional supply routing for wholesale markets."
                ],
                "caveats": "AI-assisted cultivation evidence requires official administrative verification. Not legal proof of land ownership."
            }

        return {
            "summary": f"Active flood scenario '{active_disaster.get('event_name')}' generated a city food-supply risk of {risk_score}/100 ({risk_lvl}).",
            "reasoning": f"Estimated crop production loss is {prod_loss} metric tons across {active_disaster.get('affected_parcels_count')} agricultural parcels, impacting key wholesale markets in Pune.",
            "recommended_actions": [
                "Prioritize top critical recovery parcels for emergency drainage and recovery support.",
                "Establish alternative wholesale supply lines for impacted produce categories.",
                "Conduct administrative field verification of high-evidence cultivated areas."
            ],
            "caveats": "Illustrative prototype disaster scenario and estimates — methodology demonstration."
        }
