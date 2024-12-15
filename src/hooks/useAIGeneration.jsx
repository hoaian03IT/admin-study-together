import { useEffect, useState } from "react";
import { GrokAIService } from "../apis/grokai.api";

export const useGenerateWordInformation = ({ sourceLanguage, targetLanguage, word }) => {
	const [response, setResponse] = useState({ translation: [], type: [], transcript: [] });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (sourceLanguage && targetLanguage && word) {
			setLoading(true);
			GrokAIService.getRelatedInformationWord({ sourceLanguage, targetLanguage, word })
				.then((data) => {
					console.log(data);
					setResponse({
						translation: data?.translation || [],
						type: data?.["type word"] || [],
						transcript: data?.transcript || [],
					});
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setResponse({
				translation: [],
				type: [],
				transcript: [],
			});
		}
	}, [sourceLanguage, targetLanguage, word]);
	return { translation: response.translation, type: response.type, transcript: response.transcript, loading };
};

export const useGenerateExample = ({ sourceLanguage, targetLanguage, word, definition, typeWord }) => {
	const [response, setResponse] = useState({ example: "", explanation: "", title: "" });

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (sourceLanguage && targetLanguage && word) {
			setLoading(true);
			GrokAIService.getExampleByWord({ sourceLanguage, targetLanguage, word, definition, typeWord })
				.then((data) => {
					setResponse({
						example: data?.["example sentence"],
						explanation: data?.["explanation"],
						title: data?.["title example"],
					});
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setResponse({
				example: "",
				explanation: "",
				title: "",
			});
		}
	}, [sourceLanguage, targetLanguage, word, definition, typeWord]);
	return { example: response.example, explanation: response.explanation, title: response.title, loading };
};
