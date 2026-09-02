package com.loihvk23.application_service.helper;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.ocr.TesseractOCRConfig;
import org.apache.tika.parser.pdf.PDFParserConfig;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentExtractionService {

	public String extractText(MultipartFile file) {
		try (InputStream stream = file.getInputStream()) {
			return extractTextFromStream(stream);
		} catch (Exception e) {
			throw new RuntimeException("Extract file CV error: " + e.getMessage(), e);
		}
	}

	public String extractTextFromUrl(String cvUrl) {
		try {
			URL url = new URL(cvUrl);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestProperty("User-Agent", "Mozilla/5.0");

			try (InputStream stream = connection.getInputStream()) {
				return extractTextFromStream(stream);
			}
		} catch (Exception e) {
			throw new RuntimeException("Extract file CV error: " + e.getMessage(), e);
		}
	}

	private String extractTextFromStream(InputStream stream) throws Exception {
		TesseractOCRConfig tessConfig = new TesseractOCRConfig();
		tessConfig.setLanguage("eng+vie");

		PDFParserConfig pdfConfig = new PDFParserConfig();
		pdfConfig.setOcrStrategy(PDFParserConfig.OCR_STRATEGY.AUTO);

		ParseContext context = new ParseContext();
		context.set(TesseractOCRConfig.class, tessConfig);
		context.set(PDFParserConfig.class, pdfConfig);

		BodyContentHandler handler = new BodyContentHandler(-1);
		Metadata metadata = new Metadata();
		AutoDetectParser parser = new AutoDetectParser();

		parser.parse(stream, handler, metadata, context);

		return handler.toString().trim();
	}
}
