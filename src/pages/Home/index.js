import React, { useContext, useState, useEffect } from 'react'
import firebase from '../../services/firebaseConnection';
import { Alert, Platform, TouchableOpacity } from 'react-native';
import { format, isPast } from 'date-fns';
import { AuthContext } from '../../contexts/auth'
import { Background, Container, Nome, Saldo, Title, List, Area } from './styles';
import HistoricoList from '../../components/HistoricoList';
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons'; 
import DatePicker from '../../components/DatePicker';


export default function Home() {
    const [saldo, setSaldo] = useState(0);
    const [historico, setHistorico] = useState([])
    
    const { user } = useContext(AuthContext);
    const uid = user && user.uid;

    const [newDate, setNewDate] = useState(new Date());
    const [show, setShow] = useState(false);

    useEffect(()=> {
        async function loadList(){
            await firebase.database().ref('users').child(uid).on('value', (snapshot)=> {
                setSaldo(snapshot.val().saldo);
            });

            await firebase.database().ref('historico')
            .child(uid)
            .orderByChild('date').equalTo(format(newDate, 'dd/MM/yyyy'))
            .limitToLast(10).on('value', (snapshot) => {
                setHistorico([]);

                snapshot.forEach((childItem) => {
                    let list ={
                        key: childItem.key,
                        tipo: childItem.val().tipo,
                        valor: childItem.val().valor,
                        date: childItem.val().date,
                    };

                    setHistorico(oldArray => [...oldArray, list].reverse());
                })
            })
        }

        loadList();
    }, [newDate]);

    function handleDelete(data){
        // alert(data.valor)
        if( isPast(new Date(data.date)) ){
            // Se a data do registro já passou
            alert('Você não pode excluir um registro antigo!');
            return
        }
        Alert.alert(
            'Excluir registro',
            `Você deseja excluir essa ${data.tipo}?`+'\n'+`Valor: ${data.valor}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Deletar',
                    onPress: () => handleDeleteSuccess(data)
                }
            ]
        )
    }

    async function handleDeleteSuccess(data){
        await firebase.database().ref('historico')
        .child(uid).child(data.key).remove()
        .then(async ()=> {
            let saldoAtual = saldo;
            data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) : saldoAtual -= parseFloat(data.valor) 

            await firebase.database().ref('users').child(uid)
            .child('saldo').set(saldoAtual);
        })
        .catch((error) => {
            alert(error.code)
        })
    }

    function handleShowPicker(){
         setShow(true)
    }
    function handleClose(){
         setShow(false)
    }

    const onChange = (date) => {
        setShow(Platform.OS === 'ios')
        setNewDate(date);
        console.log(date);
    }

    return (
        <Background>
            <Header/>
            <Container>
                <Nome>{user && user.nome}</Nome>
                <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Saldo>
            </Container>

            <Area>
                <TouchableOpacity onPress={handleShowPicker}>
                    <MaterialIcons name="event" color='#FFF' size={30} />
                </TouchableOpacity>
                <Title>Últimas movmentações</Title>
            </Area>

            <List 
                showsVerticalScrollIndicator={false}
                data={historico}
                keyExtractor={item => item.key}
                renderItem={ ({item}) => (
                    <HistoricoList data={item} deleteItem={handleDelete} />
                )}
            />

            {show && (
                <DatePicker 
                    onClose={handleClose}
                    date={newDate}
                    onChange={onChange}
                />
                )
            }


        </Background>
    )
}
