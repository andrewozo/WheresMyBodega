import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import axios from "axios";
import { db } from "../firebase";

import * as Location from "expo-location";

const HomeScreen = () => {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  //   async function getBodegas() {
  //     const options = {
  //       method: "GET",
  //       url: "https://api.yelp.com/v3/businesses/search",
  //       params: {
  //         latitude: `${location.coords?.latitude}`,
  //         longitude: `${location.coords?.longitude}`,
  //         term: "deli",
  //         sort_by: "distance",
  //         limit: "10",
  //       },
  //       headers: {
  //         accept: "application/json",
  //         Authorization:
  //           "Bearer HucNsE01M4jf8QoGnndK3z4LGc5ZOwR4LmHzd9jDvvC-oyEXccIdMilq-ivpk4Bk0vuOGyz4e1hHuKI_mqlsxpvXOMiD4gIEgkAyaEPbomhuWNWxZh2GodYXl1SKY3Yx",
  //       },
  //     };

  //     await axios
  //       .request(options)
  //       .then(function (response) {
  //         const bodegas = response?.data?.businesses?.map((bodega) => {
  //           addDoc(collection(db, "bodegas"), {
  //             name: bodega.name,
  //             image_url: bodega.image_url,
  //             rating: bodega.rating,
  //             latitude: bodega?.coordinates?.latitude,
  //             longitude: bodega?.coordinates?.longitude,
  //             distance: bodega?.distance,
  //           })
  //             .then(() => {
  //               console.log("data submitted");
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //         });
  //         return bodegas;
  //       })
  //       .catch(function (error) {
  //         console.error(error);
  //       });
  //   }

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
    })();
  }, []);

  if (location) {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            longitude: location.coords?.longitude,
            latitude: location.coords?.latitude,
            longitudeDelta: 0.005,
            latitudeDelta: 0.0005,
          }}
          showsUserLocation={true}
          zoomEnabled={true}
          showsMyLocationButton={true}
        />
      </View>
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
    height: "90%",
  },
});
