import LLMService "services/llmService";
import Text "mo:base/Text";

persistent actor {
    transient let llm = LLMService.LLMServiceClass();

    public func askAI(question: Text): async Text {
        await llm.getInfo(question);
    }
};