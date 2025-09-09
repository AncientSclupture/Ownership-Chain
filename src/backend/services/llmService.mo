import LLM "mo:llm";

module {
  public class LLMServiceClass() {

    private func informatifPrompt(userPrompt: Text): Text {
      return
        "You are an expert AI assistant. " #
        "Always answer clearly, step by step, and provide examples if needed. " #
        "Avoid unnecessary text and stay focused on the question. " #
        "Now, here is the user's request:\n\n" #
        userPrompt;
    };

    public func getInfo(prompt: Text): async Text {
      await LLM.prompt(#Llama3_1_8B, informatifPrompt(prompt));
    };
  };
};
