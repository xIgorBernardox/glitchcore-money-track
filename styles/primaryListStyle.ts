import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#202020',
  },

  input: {
    color: '#adff2f',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#adff2f',
    padding: 18,
    borderRadius: 8,
    marginBottom: 12,
    //outlineStyle: 'none'
  },
  addButton: {
    backgroundColor: '#adff2f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    //alignItems: 'center',
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIcon: {
    marginLeft: 4,
    marginTop: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
    backgroundColor: '#adff2f',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemButton: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  deleteText: {
    fontSize: 18,
    color: 'red',
    marginLeft: 10,
  },
  totalText: {
    color: '#adff2f',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
});

export default styles;