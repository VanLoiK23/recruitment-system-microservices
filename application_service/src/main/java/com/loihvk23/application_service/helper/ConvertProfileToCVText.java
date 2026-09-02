package com.loihvk23.application_service.helper;

import java.time.LocalDate;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.loihvk23.application_service.dto.request.CandidateProfileRequest;
import com.loihvk23.application_service.dto.request.profileEmbedded.Education;
import com.loihvk23.application_service.dto.request.profileEmbedded.Language;
import com.loihvk23.application_service.dto.request.profileEmbedded.Project;
import com.loihvk23.application_service.dto.request.profileEmbedded.WorkExperience;

@Component
public class ConvertProfileToCVText {

	public String buildCvTextFromProfile(CandidateProfileRequest p) {
		StringBuilder sb = new StringBuilder();

		if (p.getJobPosition() != null)
			sb.append(p.getJobPosition()).append(". ");
		if (p.getSummary() != null)
			sb.append(p.getSummary()).append(". ");
		if (p.getYearsOfExperience() != null)
			sb.append(p.getYearsOfExperience()).append(" years of experience. ");

		if (p.getWorkExperiences() != null && !p.getWorkExperiences().isEmpty()) {
			sb.append("Experience: ");
			p.getWorkExperiences().forEach(w -> sb.append(formatWorkExperience(w)).append(" "));
		}

		if (p.getSkills() != null && !p.getSkills().isEmpty()) {
			sb.append("Skills: ").append(String.join(", ", p.getSkills())).append(". ");
		}

		if (p.getSoftSkills() != null && !p.getSoftSkills().isEmpty()) {
			sb.append("Soft Skills: ").append(String.join(", ", p.getSoftSkills())).append(". ");
		}

		if (p.getProjects() != null && !p.getProjects().isEmpty()) {
			sb.append("Projects: ");
			p.getProjects().forEach(pj -> sb.append(formatProject(pj)).append(" "));
		}

		if (p.getEducations() != null && !p.getEducations().isEmpty()) {
			sb.append("Education: ");
			p.getEducations().forEach(e -> sb.append(formatEducation(e)).append(" "));
		}

		if (p.getLanguages() != null && !p.getLanguages().isEmpty()) {
			sb.append("Languages: ")
					.append(p.getLanguages().stream().map(Language::getLang).collect(Collectors.joining(", ")))
					.append(".");
		}
		return sb.toString();
	}

	private String formatWorkExperience(WorkExperience we) {
		String period = formatPeriod(we.getStartDate(), we.getEndDate(), we.getIsCurrent());
		String skills = (we.getSkills() != null && !we.getSkills().isEmpty()) ? String.join(", ", we.getSkills()) : "";
		return String.format("%s (%s): %s. Technologies used: %s.", nullSafe(we.getCompany()), period,
				nullSafe(we.getDesc()), skills);
	}

	private String formatEducation(Education e) {
		String period = formatPeriod(e.getStartDate(), e.getEndDate(), false);
		return String.format("%s at %s (%s). %s", nullSafe(e.getMajor()), nullSafe(e.getSchool()), period,
				nullSafe(e.getDesc()));
	}

	private String formatProject(Project p) {
		String date = p.getDate() != null ? p.getDate().toString() : "";
		return String.format("%s (%s): %s.", nullSafe(p.getProject()), date, nullSafe(p.getDesc()));
	}

	private String formatPeriod(LocalDate start, LocalDate end, Boolean isCurrent) {
		String s = start != null ? start.toString() : "";
		String e = (isCurrent != null && isCurrent) ? "Present" : (end != null ? end.toString() : "");
		return s + " - " + e;
	}

	private String nullSafe(String s) {
		return s != null ? s : "";
	}
}
