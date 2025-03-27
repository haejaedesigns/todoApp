import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, FlatList, SafeAreaView, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { StatusBar } from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState([]);
  const [itemInEdit, setItemInEdit] = useState(null);
  const [editedText, setEditedText] = useState('');

  const addTodo = () => {
    if(inputText.trim()) {
      setTodos(prevTodos => [
        ...prevTodos, 
        { 
          id: Date.now().toString(), 
          name: inputText,
          status: 'pending' // Default status
        }
      ]);
      setInputText('');
    }
  }

  const updateStatus = (itemId) => {
    setTodos(prevTodos => prevTodos.map(todo => {
      if (todo.id === itemId) {
        const statusOrder = ['pending', 'in-progress', 'done'];
        const currentIndex = statusOrder.indexOf(todo.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...todo, status: statusOrder[nextIndex] };
      }
      return todo;
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#666';
      case 'in-progress': return '#f90';
      case 'done': return '#090';
      default: return '#666';
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Todo App</Text>
      <TextInput
        style={styles.input}
        onChangeText={setInputText}
        value={inputText}
        placeholder='Enter a task'
      />
      <Button title='Add Todo' onPress={addTodo} />
      <FlatList 
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.itemListed}>
            {
              itemInEdit === item.id ? 
                <TextInput 
                  value={editedText}
                  onChangeText={setEditedText}
                  style={{...styles.input, width: '35%'}}
                  placeholder='Edit todo'
                /> : 
                <Text style={styles.itemName}>{item.name}</Text>
            }
            
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.statusButton, { backgroundColor: getStatusColor(item.status) }]}
                onPress={() => updateStatus(item.id)}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </TouchableOpacity>

              {
                itemInEdit === item.id ? (
                  <AntDesign 
                    name='check' 
                    size={24} 
                    color='green' 
                    onPress={() => {
                      setTodos(prevTodos => prevTodos.map(todo => 
                        todo.id === item.id ? {...todo, name: editedText} : todo
                      ));
                      setItemInEdit(null);
                      setEditedText('');
                    }} 
                  />
                ) : (
                  <AntDesign 
                    name='edit' 
                    size={24} 
                    color='green' 
                    onPress={() => setItemInEdit(item.id)} 
                  />
                )
              }

              <AntDesign 
                style={{marginLeft: 20}} 
                name='delete' 
                size={24} 
                color='red' 
                onPress={() => setTodos(prevTodos => prevTodos.filter(todo => todo.id !== item.id))} 
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    width: '80%',
    borderColor: 'grey',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  itemListed: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  itemName: {
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    minWidth: 90,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }
});