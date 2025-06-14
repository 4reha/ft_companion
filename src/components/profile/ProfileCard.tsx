import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { User } from "../../types/api";

import { ProfileHeader } from "./ProfileHeader";
import { CursusSelector } from "./CursusSelector";
import { LevelProgress } from "./LevelProgress";
import { StatsGrid } from "./StatsGrid";
import { SkillsList } from "./SkillsList";
import { ProjectsList } from "./ProjectsList";

interface ProfileCardProps {
  user: User;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const [selectedCursusIndex, setSelectedCursusIndex] = useState(
    user.cursus_users.findIndex(({ cursus }) => cursus.kind === "main")
  );

  const selectedCursus = user.cursus_users[selectedCursusIndex];

  const handleCursusChange = (index: number) => {
    setSelectedCursusIndex(index);
  };

  return (
    <View style={styles.container}>
      <ProfileHeader user={user} />

      <CursusSelector
        cursusUsers={user.cursus_users}
        selectedIndex={selectedCursusIndex}
        onSelectCursus={handleCursusChange}
      />

      <LevelProgress selectedCursus={selectedCursus} />

      <StatsGrid
        wallet={user.wallet}
        correctionPoint={user.correction_point}
        selectedCursus={selectedCursus}
      />
      <ProjectsList
        projects={user.projects_users}
        selectedCursusId={selectedCursus.cursus_id}
      />

      <SkillsList skills={selectedCursus.skills} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
