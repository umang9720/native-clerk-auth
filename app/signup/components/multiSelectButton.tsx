// MultiSelectButton.tsx

import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
};

const MultiSelectButton = ({ label, selected, onPress, style }: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected && styles.selected,
        style // <- allow custom style overrides
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  selected: {
    backgroundColor: "#54C381",
    borderColor: "#54C381",
  },
  label: {
    color: "#333",
    fontWeight: "500",
  },
  selectedText: {
    color: "#fff",
  },
});

export default MultiSelectButton;
