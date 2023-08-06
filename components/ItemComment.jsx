import { Image, StyleSheet, Text, View } from "react-native";
import { getDate } from "../utils/convertDate";

const ItemComment = ({ userId, data }) => {
  const isOwner = userId == data.user.id;

  const date = getDate(data.date);

  return (
    <View
      style={{
        ...styles.container,
        flexDirection: isOwner ? "row-reverse" : "row",
      }}
    >
      {data.user.photo ? (
        <Image
          source={{ uri: data.user.photo }}
          resizeMode="cover"
          style={{
            ...styles.image,
            marginRight: isOwner ? 0 : 16,
            marginLeft: isOwner ? 16 : 0,
          }}
        />
      ) : (
        <View
          style={{
            ...styles.noImage,
            marginRight: isOwner ? 0 : 16,
            marginLeft: isOwner ? 16 : 0,
          }}
        >
          <Text style={styles.noImageText}>{data.user.name.slice(0, 1)}</Text>
        </View>
      )}
      <View
        style={{
          ...styles.wrap,
          borderTopLeftRadius: isOwner ? 6 : 0,
          borderTopRightRadius: isOwner ? 0 : 6,
        }}
      >
        <Text style={styles.comment}>
          <Text style={styles.userName}>{data.user.name}: </Text>
          {data.comment}
        </Text>
        <Text style={{ ...styles.date, textAlign: isOwner ? "left" : "right" }}>
          {date}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  "container:last:child": {
    marginBottom: 0,
  },
  image: {
    width: 28,
    height: 28,

    borderRadius: 14,
  },
  noImage: {
    width: 28,
    height: 28,

    borderRadius: 14,
    backgroundColor: "#FF6C00",

    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 12,
  },
  wrap: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
    padding: 16,

    flex: 1,
  },
  comment: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    lineHeight: 18,

    color: "#212121",

    marginBottom: 8,
  },
  userName: {
    fontFamily: "Roboto-Medium",
    fontSize: 13,
    lineHeight: 18,

    color: "#bdbdbd",
  },
  date: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    lineHeight: 12,

    color: "#bdbdbd",
  },
});

export default ItemComment;
