import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Linking,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { doc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import axios from "axios";
import { db } from "../firebase";
import distance from "../distanceFormula";
import * as Location from "expo-location";
import BottomTab from "../components/BottomTab";
import HomeHeader from "../components/HomeHeader";

const HomeScreen = () => {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [bdga, setBdga] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const options = {
        method: "GET",
        url: "https://api.yelp.com/v3/businesses/search",
        params: {
          latitude: `${location.coords?.latitude}`,
          longitude: `${location.coords?.longitude}`,
          term: "deli",
          sort_by: "distance",
          limit: "10",
        },
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer HucNsE01M4jf8QoGnndK3z4LGc5ZOwR4LmHzd9jDvvC-oyEXccIdMilq-ivpk4Bk0vuOGyz4e1hHuKI_mqlsxpvXOMiD4gIEgkAyaEPbomhuWNWxZh2GodYXl1SKY3Yx",
        },
      };

      await axios
        .request(options)
        .then(function (response) {
          const bodegas = response?.data?.businesses?.map((bodega) => {
            setDoc(doc(db, "bodegas", `${bodega.id}`), {
              name: bodega.name,
              image_url: bodega.image_url,
              rating: bodega.rating,
              latitude: bodega?.coordinates?.latitude,
              longitude: bodega?.coordinates?.longitude,
              distance: bodega?.distance,
              location: bodega?.location?.display_address[0],
              phone: bodega?.display_phone,
              link: bodega?.url,
            })
              .then(() => {
                console.log("data submitted");
              })
              .catch((error) => {
                console.log(error);
              });
          });
          return bodegas;
        })
        .catch(function (error) {
          console.error(error);
        });

      getDocs(collection(db, "bodegas")).then((docSnap) => {
        let stores = [];
        docSnap.forEach((doc) => {
          stores.push({ ...doc.data(), id: doc.id });
        });
        setBdga(stores);
      });
    })();
  }, []);

  const bdgaArr = bdga.map((bodega) => {
    if (
      distance(
        location.coords?.latitude,
        bodega.latitude,
        location.coords?.longitude,
        bodega.longitude
      ) <= 1
    ) {
      return bodega;
    }
  });
  let newBdgaArr = bdgaArr.slice(0,11)
  console.log(newBdgaArr.length);

  if (location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <HomeHeader />
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              longitude: location.coords?.longitude,
              latitude: location.coords?.latitude,
              longitudeDelta: 0.05,
              latitudeDelta: 0.0005,
            }}
            region={{
              longitude: location.coords?.longitude,
              latitude: location.coords?.latitude,
              longitudeDelta: 0.05,
              latitudeDelta: 0.0005,
            }}
            showsUserLocation={true}
            zoomEnabled={true}
            showsMyLocationButton={true}
            zoomControlEnabled={true}
          >
            {newBdgaArr?.map((bodega) => {
              return (
                <Marker
                  key={bodega?.id}
                  coordinate={{
                    latitude: bodega?.latitude,
                    longitude: bodega?.longitude,
                  }}
                  pinColor="#004aad"
                  tappable={true}
                >
                  <Callout tooltip>
                    <View>
                      <View style={styles.bubble}>
                        <Text style={styles.name}>{bodega?.name}</Text>

                        <Text style={styles.name}>{bodega?.location}</Text>
                        <Text style={styles.name}>{bodega?.phone}</Text>
                        <Text
                          style={styles.name}
                        >{`${bodega?.rating} Stars`}</Text>

                        <Image
                          style={styles.image}
                          source={bodega?.image_url}
                        />
                      </View>
                      <View style={styles.arrowBorder} />
                      <View style={styles.arrow} />
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
          <BottomTab />
        </View>
      </SafeAreaView>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "80%",
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#ffff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  name: {
    fontFamily: "ChalkboardSE-Bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#ff914d",
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  image: {
    width: 50,
    height: 50,
  },
});
