import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const carsData = [
  { id: '1', name: 'Carro 1', image: require('./assets/E-tron.png'), valorPorDia: 50 },
  { id: '2', name: 'Carro 2', image: require('./assets/E-tron.png'), valorPorDia: 60 },
  { id: '3', name: 'Carro 3', image: require('./assets/E-tron.png'), valorPorDia: 70 },
  { id: '4', name: 'Carro 4', image: require('./assets/E-tron.png'), valorPorDia: 70 },
  { id: '5', name: 'Carro 5', image: require('./assets/E-tron.png'), valorPorDia: 70 },
  { id: '6', name: 'Carro 6', image: require('./assets/E-tron.png'), valorPorDia: 70 },
  { id: '7', name: 'Carro 7', image: require('./assets/E-tron.png'), valorPorDia: 70 },
  { id: '8', name: 'Carro 8', image: require('./assets/E-tron.png'), valorPorDia: 70 },
  // Adicione valorPorDia para outros carros
];

const carDetails = [
  { id: '1', color: 'Azul', MaxSpeed: '200km/h', door: '4' },
  { id: '2', color: 'Verde', MaxSpeed: '250km/h', door: '4' },
  { id: '3', color: 'Vermelho', MaxSpeed: '180km/h', door: '4' },
  { id: '4', color: 'Preto', MaxSpeed: '180km/h', door: '4' },
  { id: '5', color: 'Amarelo', MaxSpeed: '180km/h', door: '4' },
  { id: '6', color: 'Vinho', MaxSpeed: '180km/h', door: '4' },
  { id: '7', color: 'Branco', MaxSpeed: '180km/h', door: '4' },
  { id: '8', color: 'Vermelo', MaxSpeed: '180km/h', door: '4' },
  // Adicione descrições para outros carros
];

export default function App() {
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [pickupDatePickerVisible, setPickupDatePickerVisible] = useState(false);
  const [returnDatePickerVisible, setReturnDatePickerVisible] = useState(false);

  useEffect(() => {
    calculateTotalCost();
  }, [pickupDate, returnDate]);

  const renderCarItem = ({ item }) => {
    const carDetail = carDetails.find((detail) => detail.id === item.id);

    return (
      <View style={styles.carItem}>
        <Image source={item.image} style={styles.carImage} />
        <Text style={styles.carText}>{item.name}</Text>
        <Text style={styles.carText}>{`Valor por dia: R$ ${item.valorPorDia}`}</Text>
        <Button title="Alugar" onPress={() => handleRent(item)} />
      </View>
    );
  }

  const handleRent = (car) => {
    setSelectedCar(car);
    setDetailsModalVisible(true);
  }

  const calculateTotalCost = () => {
    if (pickupDate && returnDate) {
      const timeDifference = returnDate.getTime() - pickupDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      if (selectedCar) {
        const total = daysDifference * selectedCar.valorPorDia;
        setTotalCost(total);
      }
    }
  }

  const handleConfirmRent = () => {
    calculateTotalCost();

    // Implemente a lógica para confirmar o aluguel aqui.
    // Por exemplo, você pode enviar os detalhes ao servidor.
    // Em vez disso, vou exibir uma mensagem de pop-up aqui.
    const message = `Carro alugado com sucesso!\nValor total: R$ ${totalCost.toFixed(2)}\nData de retirada: ${pickupDate ? pickupDate.toDateString() : 'N/A'}`;
    setPopupMessage(message);
    setPopupVisible(true);
    setDetailsModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Suutz Carros Elétricos</Text>
      </View>
      <FlatList
        data={carsData}
        keyExtractor={(item) => item.id}
        renderItem={renderCarItem}
      />

      <Modal
        visible={detailsModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCarDetails && (
              <View>
                <Text style={styles.modalText}>Cor: {selectedCarDetails.color}</Text>
                <Text style={styles.modalText}>Velocidade Máxima: {selectedCarDetails.MaxSpeed}</Text>
                <Text style={styles.modalText}>Portas: {selectedCarDetails.door}</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setPickupDatePickerVisible(true)}>
              <Text>Retirada: {pickupDate ? pickupDate.toDateString() : 'Selecionar Data'}</Text>
            </TouchableOpacity>
            {pickupDatePickerVisible && (
              <DateTimePicker
                value={pickupDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (event.type === 'set') {
                    setPickupDate(date);
                  }
                  setPickupDatePickerVisible(false);
                }}
              />
            )}
            <TouchableOpacity onPress={() => setReturnDatePickerVisible(true)}>
              <Text>Devolução:  {returnDate ? returnDate.toDateString() : 'Selecionar Data'}</Text>
            </TouchableOpacity>
            {returnDatePickerVisible && (
              <DateTimePicker
                value={returnDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (event.type === 'set') {
                    setReturnDate(date);
                  }
                  setReturnDatePickerVisible(false);
                }}
              />
            )}
            <Text style={styles.modalText}>{`Total: R$ ${totalCost.toFixed(2)}`}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Confirmar Aluguel" onPress={handleConfirmRent} />
              <Text></Text>
              <Button title="Sair" onPress={() => setDetailsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {popupVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={popupVisible}
          onRequestClose={() => setPopupVisible(false)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <Text style={styles.popupText}>{popupMessage}</Text>
              <Button title="Fechar" onPress={() => setPopupVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  header: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  carItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    alignItems: 'center',
  },
  carImage: {
    width: 150,
    height: 100,
    borderRadius: 20,
  },
  carText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
});