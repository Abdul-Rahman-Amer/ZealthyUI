import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList , Button} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Admin = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const response = await axios.get('http://52.201.226.68/tickets');
          setTickets(response.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };
  
      fetchTickets();
    }); 

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return '#FF6347'; // Tomato red
      case 'in progress':
        return '#FFD700'; // Gold
      case 'resolved':
        return '#32CD32'; // Lime green
      default:
        return '#808080'; // Grey for undefined status
    }
  };

  const CustomButton = ({ title, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  const updateStatus = async (ticketId, newStatus) => {
    console.log(ticketId, newStatus);
    try {
      await axios.post('http://52.201.226.68//update_status', {
        ticketId,
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Update the status locally in the tickets state
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      );
      setTickets(updatedTickets);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  


  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.ticketItem}>
            <View style={styles.ticketContent}>
              <Icon name="assignment" size={30} color={getStatusColor(item.status)} style={styles.icon} />
              <View>
                <Text style={styles.ticketTitle}>{item.name}</Text>
                <Text style={styles.ticketInfo}>
  {item.priority === 'High' && (
    <Icon name="priority-high" size={20} color="#FF6347" />
  )}
  Priority: {item.priority}
</Text>
                <Text style={styles.ticketInfo}>Status: {item.status}</Text>
                <Text style={styles.ticketInfo}>Description: {item.description}</Text>
                <View style={styles.buttonContainer}>
                  <CustomButton title="New" onPress={() => updateStatus(item.id, 'new')} />
                  <CustomButton title="In Progress" onPress={() => updateStatus(item.id, 'in progress')} />
                  <CustomButton title="Resolved" onPress={() => updateStatus(item.id, 'resolved')} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    padding: 10,
  },
  ticketItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  ticketContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  ticketInfo: {
    fontSize: 16,
    color: '#555555',
    marginTop: 5,
    fontStyle: 'italic',
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,

  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
  
    fontSize: 16,
  },
});

export default Admin;
