import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  input: {
    color: '#adff2f',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#adff2f',
    padding: 18,
    borderRadius: 8,
    marginBottom: 10,
    //outlineStyle: 'none',
  },
  addButton: {
    backgroundColor: '#adff2f',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIcon: {
    marginLeft: 4,
    marginTop: 1,
  },
  removeIcon: {
    marginLeft: 12,
  },

  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  itemText: {
    color: '#adff2f',
    flex: 1,
  },
  itemPrice: {
    color: '#adff2f',
    marginRight: 16,
  },
  deleteText: {
    marginLeft: 10,
    color: '#ff4d4d',
    fontSize: 18,
  },
  footer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#333',
    marginTop: 'auto',
  },
  totalText: {
    color: '#adff2f',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
export default styles;