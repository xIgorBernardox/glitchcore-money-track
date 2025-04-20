import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#adff2f',
    color: '#adff2f',
    padding: 18,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16
  },
  button: {
    width: '100%',
    backgroundColor: '#adff2f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  registerText: {
    color: '#adff2f',
    marginTop: 20,
    textDecorationLine: 'underline',
    textShadowColor: '#adff2f',
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 10
  },
});
export default styles;