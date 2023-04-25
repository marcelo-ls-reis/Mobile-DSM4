import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../services/api';
import {Keyboard, ActivityIndicator} from 'react-native';

export default class Main extends Component { 
  state = {
    // state is an object
    newUser: '',
    users: [],
    loading: false,
  };

    async componentDidMount() { // busca os dados do AsyncStorage
    const users = await AsyncStorage.getItem('users'); // get users para AsyncStorage

    if (users) {
      this.setState({users: JSON.parse(users)}); // set users para state
    }
}

    async componentDidUpdate(_, prevState) { // salva os dados no AsyncStorage
    const {users} = this.state; // desestruturando

    if (prevState.users !== users) {
       await AsyncStorage.setItem('users', JSON.stringify(users)); // set users para AsyncStorage
    }
}

  handleAddUser = async () => { // adiciona um novo usuário
    const {users, newUser} = this.state; // desestruturando

    this.setState({loading: true}); // setando o loading para true

    const response = await api.get(`/users/${newUser}`); // chamando a api

    const data = {
      // data is an object
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };
    console.log(data);

    this.setState({
      // setState is a function
      users: [...users, data],
      newUser: '',
      loading: false,
    });

    Keyboard.dismiss();
  };

  render() {
    const {users, newUser, loading} = this.state; // desestruturando

    return (
      <Container> 
        <Form>
          <Input
            autoCorrect={false} 
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (<ActivityIndicator color="#fff" />) : (
            <Icon name="add" size={20} color="#fff" />)}
          </SubmitButton>
        </Form>
        <List
          showsVerticalScrollIndicator={false}
          data={users}
          keyExtractor={user => user.login}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => {}}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
