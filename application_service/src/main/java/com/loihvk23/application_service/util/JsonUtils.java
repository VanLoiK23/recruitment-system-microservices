package com.loihvk23.application_service.util;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtils {
	private static final ObjectMapper mapper = new ObjectMapper();

	public static boolean isValidJson(String jsonString) {

		if (jsonString == null || jsonString.isBlank()) {
			return false;
		}

		try {
			mapper.readTree(jsonString);
			return true;
		} catch (JacksonException e) {
			return false;
		}
	}
}
