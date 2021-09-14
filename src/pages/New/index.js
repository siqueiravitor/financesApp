import React, { useState, useContext } from 'react'
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header'
import { Background, Input, SubmitButton, SubmitText } from './styles';
import Picker from '../../components/Picker';

export default function New() {
    const navigation = useNavigation();

    const { user: usuario } = useContext(AuthContext);
    const [valor, setValor ]= useState("");
    const [tipo, setTipo ]= useState(null);

    function handleSubmit(){
        Keyboard.dismiss();
        if(isNaN(parseFloat(valor)) || tipo === null){
            alert('Preencha todos os campos!');
            return;
        }

        Alert.alert(
            'Confirmando dados',
            `Tipo ${tipo}`+'\n'+`Valor: R$ ${parseFloat(valor).toFixed(2)}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Registrar',
                    onPress: () => handleAdd() 
                }
            ]
        )

    }

    async function handleAdd(){
        let uid = usuario.uid;
        let key = await firebase.database().ref('historico').child(uid).push().key;

        await firebase.database().ref('historico').child(uid).child(key).set({
            tipo: tipo,
            valor: parseFloat(valor),
            date: format(new Date(), 'dd/MM/yyyy')
        })

        //Atualizar saldo
        let user = firebase.database().ref('users').child(uid);
        await user.once('value').then((snapshot) => {
            let saldo = parseFloat(snapshot.val().saldo);

            tipo === 'despesa' ? saldo -= parseFloat(valor) : saldo += parseFloat(valor);

            user.child('saldo').set(saldo);
        });
        Keyboard.dismiss();
        setValor('');
        navigation.navigate('Home');
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Background>
                <Header />
                <SafeAreaView style={{ alignitems: 'center' }}>
                    <Input 
                        placeholder="Valor desejado"
                        keyboardType="numeric"
                        returnkeyType="next"
                        onSubmitEditing={()=> Keyboard.dismiss()}
                        value={valor}
                        onChangeText={(text) => setValor(text)}
                    />

                    <Picker onChange={setTipo} tipo={tipo}/>

                <SubmitButton onPress={handleSubmit}>
                    <SubmitText>Registrar</SubmitText>
                </SubmitButton>
                </SafeAreaView>
            </Background>
        </TouchableWithoutFeedback>
    )
}
