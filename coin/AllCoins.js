import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  AsyncStorage,
  ToastAndroid,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {WebView} from 'react-native-webview';
LogBox.ignoreLogs(['Warning: ...']);

export class AllCoins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      favori: false,
      portfoy: false,
      data: [],
      data2: [],
      adet: '',
      fiyat: '',
      text: '',
      graf: false,
      grf: '',
      loading: true,
    };
  }
  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const response = await fetch(
        'https://api.coinstats.app/public/v1/coins?skip=0&limit=2000',
      );
      const json = await response.json();
      this.setState({data: json.coins});
    } catch (e) {
      console.log(e);
    }
  };
  setModalVisible = visible => {
    this.setState({isVisible: visible, favori: false, portfoy: false});
  };
  setModalFavori = visible => {
    this.setState({favori: visible, isVisible: false, portfoy: false});
  };
  setModalPortfoy = visible => {
    this.setState({portfoy: visible, isVisible: false, favori: false});
  };
  favoriEkle = async () => {
    try {
      const user_id = await AsyncStorage.getItem('USERS_ID');
      await fetch(
        'http://api.sudesineklik.com/api/forum/Favori?userid=' +
          user_id +
          '&coin=' +
          this.state.fname +
          '&deger=' +
          this.state.fdeger,
      );
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  portfoyEkle = async () => {
    try {
      const user_id = await AsyncStorage.getItem('USERS_ID');
      await fetch(
        'http://api.sudesineklik.com/api/forum/Portfolio?userid=' +
          user_id +
          '&coin=' +
          this.state.fname +
          '&degisim=0&deger=' +
          this.state.fdeger +
          '&adet=' +
          this.state.adet,
      );
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  aramaKontrol = () => {
    console.log(this.state.text);
    const regexp = new RegExp(this.state.text, 'i');
    var a = this.state.data.filter(x => regexp.test(x.name));
    this.setState({data2: a});
  };

  render() {
    return (
      <View style={{backgroundColor: '#14142A'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            backgroundColor: 'white',
          }}>
          <TextInput
            style={{height: 41, width: Dimensions.get('window').width - 60}}
            placeholder="Aranacak Coin Adını Giriniz"
            onChangeText={text => {
              this.setState({text});
              this.aramaKontrol();
            }}
            value={this.state.text}
          />
          <AntDesign name="search1" size={40} color="black" />
        </View>
        <FlatList
          data={this.state.text === '' ? this.state.data : this.state.data2}
          keyExtractor={({id}, i) => i}
          renderItem={({item, index}) => (
            <View>
              <View style={{marginTop: 5, paddingLeft: 5, paddingRight: 5}}>
                <View style={styles.Views}>
                  <View
                    style={{
                      width: Dimensions.get('window').width / 2,
                      flexDirection: 'row',
                    }}>
                    <View style={{width: 40}}>
                      <Text style={styles.Text}>{item.rank}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        /*
                        this.props.navigation.navigate('Others', {
                          itemId: item.symbol,
                        })*/
                        this.setState({grf: item.symbol, graf: true})
                      }
                      onLongPress={() => {
                        this.setState({
                          isVisible: true,
                          fname: item.name,
                          fdeger: parseFloat(item.price).toFixed(2),
                        });
                      }}>
                      <View
                        style={{
                          width: Dimensions.get('window').width / 2 - 30,
                          justifyContent: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{width: 25, height: 25}}
                          source={{
                            uri: item.icon,
                          }}
                        />
                        <Text style={styles.Text}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: Dimensions.get('window').width / 2,
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        width: 80,
                        paddingLeft: 10,
                        paddingRight: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {item.priceChange1d < 0 ? (
                        <View style={{flexDirection: 'row'}}>
                          <AntDesign name="caretdown" size={20} color="red" />
                          <Text
                            style={
                              (styles.Text, {color: 'red', marginLeft: 3})
                            }>
                            {item.priceChange1d} %
                          </Text>
                        </View>
                      ) : (
                        <View style={{flexDirection: 'row'}}>
                          <AntDesign name="caretup" size={20} color="#66ff00" />
                          <Text
                            style={
                              (styles.Text, {color: '#66ff00', marginLeft: 3})
                            }>
                            {item.priceChange1d} %
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        width: Dimensions.get('window').width / 2 - 90,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {item.priceChange1d < 0 ? (
                        <Text style={(styles.Text, {color: 'red'})}>
                          {parseFloat(item.price).toFixed(2)}
                        </Text>
                      ) : (
                        <Text style={(styles.Text, {color: '#66ff00'})}>
                          $ {parseFloat(item.price).toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => {
            this.setModalVisible(!isVisible);
          }}>
          <View
            style={{
              height: '20%',
              marginTop: 'auto',
              marginLeft: '5%',
              marginRight: '5%',
              marginBottom: 60,
              transparent: 'true',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                padding: 10,
                borderBottomWidth: 0.5,
                borderColor: 'black',
                alignItems: 'center',
                backgroundColor: '#d3d3d3',
                borderTopStartRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <TouchableOpacity
                style={{width: '100%', alignItems: 'center'}}
                onPress={() => {
                  this.setModalFavori(!this.state.favori);
                  console.log('bırdayım');
                }}>
                <Text style={styles.modalText}>Favori</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={{width: '100%', alignItems: 'center'}}
                onPress={() => {
                  this.setModalPortfoy(!this.state.portfoy);
                }}>
                <Text style={styles.modalText}>Portföy</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                width: '100%',
                alignItems: 'center',
                alignContent: 'space-between',
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 10,
              }}
              onPress={() => {
                this.setModalVisible(!this.state.isVisible);
              }}>
              <Text style={{fontSize: 24}}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.favori}
          onRequestClose={() => {
            this.setModalFavori(!favori);
          }}>
          <View
            style={{
              height: '20%',
              marginTop: '60%',
              marginLeft: '5%',
              marginRight: '5%',
              marginBottom: 60,
              transparent: 'true',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#d3d3d3',
              borderRadius: 15,
            }}>
            <View style={{height: '60%', justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 24,
                  textAlign: 'center',
                  color: 'black',
                  fontWeight: 'bold',
                  margin: 5,
                }}>
                Seçilen Coin Favorilere Eklensin mi?
              </Text>
            </View>
            <View
              style={{
                height: '40%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  borderRightWidth: 0.5,
                  borderTopWidth: 0.5,
                  width: '50%',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.setModalFavori(!this.state.favori);
                  }}>
                  <Text style={styles.modalText}>Vazgeç</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderTopWidth: 0.5,
                  width: '50%',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.setModalFavori(!this.state.favori);
                  }}>
                  <Text style={styles.modalText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.portfoy}>
          <KeyboardAvoidingView
            style={{flexDirection: 'column', justifyContent: 'center'}}
            behavior="padding"
            enabled
            keyboardVerticalOffset={100}>
            <ScrollView>
              <View
                style={{
                  height: '60%',
                  marginTop: '30%',
                  marginLeft: '5%',
                  marginRight: '5%',
                  marginBottom: 60,
                  transparent: 'true',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#d3d3d3',
                  borderRadius: 15,
                }}>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontSize: 24,
                      textAlign: 'center',
                      color: 'black',
                      fontWeight: 'bold',
                      margin: 5,
                    }}>
                    Portföy Ekle
                  </Text>
                  <TextInput
                    onChangeText={adet => this.setState({adet})}
                    value={this.state.adet}
                    style={{
                      backgroundColor: 'white',
                      borderBottomWidth: 1,
                      fontSize: 18,
                    }}
                    placeholder="Adet Giriniz"
                    keyboardType="numeric"
                  />
                  <TextInput
                    onChangeText={fiyat => this.setState({fiyat})}
                    value={this.state.fiyat}
                    style={{backgroundColor: 'white', fontSize: 18}}
                    placeholder="Fiyat Giriniz"
                    keyboardType="numeric"
                  />
                </View>
                <View
                  style={{
                    height: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 5,
                    borderRadius: 15,
                  }}>
                  <View
                    style={{
                      borderRightWidth: 0.5,
                      borderTopWidth: 0.5,
                      width: '50%',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        this.setModalFavori(!this.state.portfoy);
                      }}>
                      <Text style={styles.modalText}>Vazgeç</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      borderTopWidth: 0.5,
                      width: '50%',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        if (this.state.adet > 0) {
                          this.portfoyEkle();
                          this.setModalVisible(false);
                        } else {
                          ToastAndroid.showWithGravity(
                            'Lütfen Adet Giriniz',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER,
                          );
                        }
                      }}>
                      <Text style={styles.modalText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          animationType="slide"
          visible={this.state.graf}
          onRequestClose={() => {
            this.setState({graf: false});
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#14142A',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            {this.state.loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : null}
            <WebView
              source={{
                uri:
                  'http://forum.sudesineklik.com/sayfalar/grafik?symbol=' +
                  this.state.grf +
                  'USD',
              }}
              style={{
                backgroundColor: '#14142A',
                flex: 1,
                justifyContent: 'center',
              }}
              onLoadEnd={() => this.setState({loading: false})}
              onLoad={() => this.setState({loading: false})}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Views: {
    borderBottomWidth: 0.5,
    paddingBottom: 15,
    borderBottomColor: '#d3d3d3',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  Text: {
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    margin: 5,
    borderRadius: 5,
    color: 'white',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00BCD4',
    height: 200,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 80,
    marginLeft: 40,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    alignContent: 'space-between',
    backgroundColor: '#d3d3d3',
    borderBottomEndRadius: 15,
    borderBottomLeftRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 24,
  },
});
export default AllCoins;
