import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: 'Roboto',
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#4F46E5',
    paddingBottom: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  position: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 8.5,
    color: '#64748B',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionBody: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 3,
  },
  itemBlock: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  itemDate: {
    fontSize: 8.5,
    color: '#64748B',
  },
  itemSub: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  description: {
    fontSize: 9,
    color: '#334155',
    textAlign: 'justify',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#F1F5F9',
    color: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 3,
    fontSize: 8,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 2,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    color: '#4F46E5',
  },
  bulletContent: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
  },
});

const parseFormattedText = (html) => {
  if (!html) return [];
  const cleanStr = html
    .replace(/&nbsp;/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();

  return cleanStr
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const RenderRichContent = ({ htmlContent }) => {
  const lines = parseFormattedText(htmlContent);
  if (lines.length === 0) return null;

  return (
    <View style={{ marginTop: 2 }}>
      {lines.map((line, idx) => {
        const isBullet = line.startsWith('-') || line.startsWith('•');
        const textText = isBullet ? line.replace(/^[-•]\s*/, '') : line;

        if (isBullet) {
          return (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletContent}>{textText}</Text>
            </View>
          );
        }

        return (
          <Text key={idx} style={[styles.description, { marginBottom: 2 }]}>
            {textText}
          </Text>
        );
      })}
    </View>
  );
};

const CvTemplate = ({
  profileInfo,
  summary,
  skills,
  softSkills,
  languages,
  works,
  educations,
  projects,
}) => {
  const userSummary = summary || profileInfo?.summary;
  const techSkills = skills || profileInfo?.skills || [];
  const sSkills = softSkills || profileInfo?.softSkills || [];
  const langList = languages || profileInfo?.languages || [];
  const workList = works || profileInfo?.workExperiences || [];
  const eduList = educations || profileInfo?.educations || [];
  const projectList = projects || profileInfo?.projects || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profileInfo?.fullName || 'Candidate Name'}</Text>
          <Text style={styles.position}>
            {profileInfo?.jobPosition || 'Software Engineer'}
            {profileInfo?.yearsOfExperience
              ? `  |  ${profileInfo.yearsOfExperience}+ Years Experience`
              : ''}
          </Text>
          <View style={styles.contactRow}>
            {profileInfo?.phone && <Text style={styles.contactItem}>Phone: {profileInfo.phone}</Text>}
            {profileInfo?.emailCandidate && <Text style={styles.contactItem}>Email: {profileInfo.emailCandidate}</Text>}
            {profileInfo?.cityProvince && <Text style={styles.contactItem}>Loc: {profileInfo.cityProvince}</Text>}
            {profileInfo?.github && <Text style={styles.contactItem}>GitHub: {profileInfo.github}</Text>}
            {profileInfo?.linkedin && <Text style={styles.contactItem}>LinkedIn: {profileInfo.linkedin}</Text>}
          </View>
        </View>

        {userSummary && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <RenderRichContent htmlContent={userSummary} />
          </View>
        )}

        {techSkills.length > 0 && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.badgeContainer}>
              {techSkills.map((skill, index) => (
                <Text key={index} style={styles.badge}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {workList.length > 0 && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {workList.map((work, idx) => (
              <View key={idx} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{work.company || 'Company Name'}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(work.startDate)} - {work.isCurrent ? 'Present' : formatDate(work.endDate)}
                  </Text>
                </View>
                <RenderRichContent htmlContent={work.desc} />
                {work.skills && work.skills.length > 0 && (
                  <View style={styles.badgeContainer}>
                    {work.skills.map((s, idxSkill) => (
                      <Text key={idxSkill} style={styles.badge}>
                        {s}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {projectList.length > 0 && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projectList.map((proj, idx) => (
              <View key={idx} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.project || 'Project Title'}</Text>
                  <Text style={styles.itemDate}>{formatDate(proj.date)}</Text>
                </View>
                <RenderRichContent htmlContent={proj.desc} />
              </View>
            ))}
          </View>
        )}

        {eduList.length > 0 && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>Education</Text>
            {eduList.map((edu, idx) => (
              <View key={idx} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.school || 'University Name'}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                {edu.major && <Text style={styles.itemSub}>{edu.major}</Text>}
                <RenderRichContent htmlContent={edu.desc} />
              </View>
            ))}
          </View>
        )}

        {(sSkills.length > 0 || langList.length > 0) && (
          <View style={styles.sectionBody}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            {langList.length > 0 && (
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 8.5, color: '#475569', marginBottom: 2 }}>
                  Languages
                </Text>
                <View style={styles.badgeContainer}>
                  {langList.map((item, index) => {
                    const langText = typeof item === 'string' ? item : item?.lang || '';
                    return langText ? (
                      <Text key={index} style={styles.badge}>
                        {langText}
                      </Text>
                    ) : null;
                  })}
                </View>
              </View>
            )}

            {sSkills.length > 0 && (
              <View style={{ marginTop: 4 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 8.5, color: '#475569', marginBottom: 2 }}>
                  Soft Skills
                </Text>
                <View style={styles.badgeContainer}>
                  {sSkills.map((skill, index) => (
                    <Text key={index} style={styles.badge}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CvTemplate;