import LLM "mo:llm";
import AssetStorage "../storage/AssetStorage";
import DataType "../data/dataType";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Error "mo:base/Error";

module {

  public class LLMServiceClass(assetStorage : AssetStorage.AssetStorageClass) {

    private func informatifPrompt(userPrompt : Text) : Text {
      return "You are an expert AI assistant. " #
      "Always answer clearly, step by step, and provide examples if needed. " #
      "Avoid unnecessary text and stay focused on the question. " #
      "Now, here is the user's request:\n\n" #
      userPrompt;
    };

    public func getInfo(prompt : Text) : async Text {
      await LLM.prompt(#Llama3_1_8B, informatifPrompt(prompt));
    };

    private func assetPrompt(userPrompt : Text, assetDetails : DataType.Asset) : Text {

      return "You are an expert AI assistant. " #
      "Always answer clearly. \n" #
      "Here are the asset details:\n" #
      assetDetails.name #
      assetDetails.description #
      "dengan risk score:\n" #
      Float.toText(assetDetails.riskScore) #
      "\n" #
      "Now, here is the user's request:\n" #
      userPrompt;
    };

    public func getAssetInfo(prompt : Text, assetId : Text) : async Text {

      switch (assetStorage.get(assetId)) {
        case (null) { return "Asset not found." };
        case (?details) {
          try {
            await LLM.prompt(#Llama3_1_8B, assetPrompt(prompt, details));
          } catch (err) {
            return "⚠️ LLM call failed: " # Error.message(err);
          };
        };
      };
    };

  };
};
