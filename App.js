import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'

class Botao extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    let bg  = 'gray'
    if (props.cor) {
      bg = props.cor
    }

    this.styles = StyleSheet.create({
      botao: {
        flex: 1,
        backgroundColor: bg,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10
      },
      botaoTexto: {
        fontSize: 30
      }
    })
  }

  render () {
    return (
      <TouchableOpacity style={this.styles.botao} onPress={this.props.onPress}>
        <Text style={this.styles.botaoTexto}>{this.props.texto}</Text>
      </TouchableOpacity>
    )
  }

}

export default class AppCalculadora extends Component {

  constructor(props) {
    super(props)
    this.state = {texto: '', expressao: ''}
    this.memoria = 0
    this.parcela = null
    this.operacao = null
    this.decimal = false
    this.isResult = false

    this.operar = this.operar.bind(this)
  }
  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  operar(b) {
    let s = this.state
    
    switch (b) {
      case 'C':
        s.texto = ''
        s.expressao = ''
        this.isResult = false
        this.parcela = null
        this.operacao = null
        this.decimal = false
      break;
      case 'CE':
        s.texto = ''
        this.isResult = false
      break;
      case 'MC':
        this.memoria = 0
      break;
      case 'MR':
        s.texto = this.memoria
      break;
      case 'M+':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        this.memoria = this.memoria + eval(s.texto)
        s.texto = ''
        this.isResult = false
      break;
      case 'M-':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        this.memoria = this.memoria - eval(s.texto)
        s.texto = ''
        this.isResult = false
      break;
      case 'MS':
        this.memoria = s.texto
        s.texto = ''
        this.isResult = false
      break;
      case '%':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        this.isResult = true
        s.expressao = 'porcentagem(' + s.texto + ') ='
        s.texto = eval(s.texto)/100
      break;
      case 'Del':
        if (!this.isResult) {
          s.texto = s.texto.slice(0,s.texto.length-1)
        }
      break;
      case '1/x':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        this.isResult = true
        s.expressao = '1/' + s.texto + ' ='
        s.texto = 1/eval(s.texto)
      break;
      case 'x²':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        this.isResult = true
        s.expressao = '(' + s.texto + ')² ='
        s.texto = eval(s.texto) * eval(s.texto)
      break;
      case 'sqrt':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        this.isResult = true
        s.expressao = 'raiz(' + s.texto + ') ='
        s.texto = Math.sqrt(eval(s.texto))
      break;
      case '+/-':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        this.isResult = true
        s.expressao = `negate(${s.texto}) =`
        s.texto = eval(s.texto) * (-1)
      break;
      case ',':
        if (this.isResult) {
          s.texto = ''
          this.isResult = false
        }
        if (s.texto.length == 0) {
          s.texto = '0'
        }
        if (!this.decimal) {
          s.texto = s.texto + '.'
          this.setState(s)
          this.decimal = true
        } else {
          let achou = false
          for(let index = 0; index < s.texto.length; index++) {
            if (s.texto[index] == '.') {
              achou = true
              break
            }
          }
          if (!achou) {
            this.decimal = false
            this.operar(',')
          }
        }
      break;
      case '=':
        if (!this.isNumber(s.texto[s.texto.length-1])) {
          s.texto = s.texto.slice(0, s.texto.length-1)
        }
        s.expressao = s.texto + ' = '
        s.texto = eval(s.texto)
        this.isResult = true
      break;
      default:
        if (this.isResult) {
          s.texto = ''
          s.expressao = ''
          this.isResult = false
        }
        if ((!this.isNumber(b) && this.isNumber(s.texto[s.texto.length-1])) || (this.isNumber(b) && this.isNumber(s.texto[s.texto.length-1]))|| (this.isNumber(b) && !this.isNumber(s.texto[s.texto.length-1])))
          s.texto += b
        break;
      }
      this.setState(s)
  }

  render() {
    return (
      <View style={styles.area} >
        <Text style={styles.titulo} >App Calculadora</Text>
        <View style={styles.visor} >
          <Text style={styles.textoSuperiorVisor} >{this.state.expressao}</Text>
          <Text style={styles.textoVisor} >{this.state.texto}</Text>
        </View>
        <View style={styles.teclado} >
          <View style={styles.linha}>
            <Botao texto='MC' onPress={() => {this.operar('MC')}} />
            <Botao texto='MR' onPress={() => {this.operar('MR')}} />
            <Botao texto='M+' onPress={() => {this.operar('M+')}} />
            <Botao texto='M-' onPress={() => {this.operar('M-')}} />
            <Botao texto='MS' onPress={() => {this.operar('MS')}} />
          </View>
          <View style={styles.linha}>
            <Botao texto='%' onPress={() => {this.operar('%')}} />
            <Botao texto='CE' onPress={() => {this.operar('CE')}} />
            <Botao texto='C' onPress={() => {this.operar('C')}} />
            <Botao texto='Del' onPress={() => {this.operar('Del')}} />
          </View>
          <View style={styles.linha}>
            <Botao texto='1/x' onPress={() => {this.operar('1/x')}} />
            <Botao texto='x²' onPress={() => {this.operar('x²')}} />
            <Botao texto='sqrt' onPress={() => {this.operar('sqrt')}} />
            <Botao texto='X' onPress={() => {this.operar('*')}} />
          </View>
          <View style={styles.linha}>
            <Botao texto='1' onPress={() => {this.operar('1')}} />
            <Botao texto='2' onPress={() => {this.operar('2')}} />
            <Botao texto='3' onPress={() => {this.operar('3')}} />
            <Botao texto='/' onPress={() => {this.operar('/')}} />
          </View>
          <View style={styles.linha}>
            <Botao texto='4' onPress={() => {this.operar('4')}} />
            <Botao texto='5' onPress={() => {this.operar('5')}} />
            <Botao texto='6' onPress={() => {this.operar('6')}} />
            <Botao texto='-' onPress={() => {this.operar('-')}} />
          </View>
          <View style={styles.linha}>
            <Botao texto='7' onPress={() => {this.operar('7')}} />
            <Botao texto='8' onPress={() => {this.operar('8')}} />
            <Botao texto='9' onPress={() => {this.operar('9')}} />
            <Botao texto='+' onPress={() => {this.operar('+')}} />
          </View>
          <View style={styles.linha}>
            <Botao texto='+/-' onPress={() => {this.operar('+/-')}} />
            <Botao texto='0' onPress={() => {this.operar('0')}} />
            <Botao texto=',' onPress={() => {this.operar(',')}} />
            <Botao cor='#2445BB' texto='=' onPress={() => {this.operar('=')}} />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  area: {
    flex: 1
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 40
  },
  visor: {
    flex: 4,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  textoVisor:{
    fontSize: 50,
    margin: 30
  },
  textoSuperiorVisor: {
    marginRight: 40
  },
  teclado: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linha: {
    flexDirection: 'row'
  }
})