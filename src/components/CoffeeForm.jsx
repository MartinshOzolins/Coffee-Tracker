import React, { useState } from "react";
import { coffeeOptions } from "../utils";

//useAuth() - custom hook created inside AuthContext.jsx, which provied all values that we pass in AuthContext.Provider
import { useAuth } from "../context/AuthContext";

//components
import Modal from "./Modal";
import Authentication from "./Authentication";

//firebase
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CoffeeFrom(props) {
  const {isAuthenticated} = props
  const [showModal, setShowModal] = useState(false)

  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [coffeeCost, setCoffeeCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const {globalData, setGlobalData, globalUser} = useAuth()

  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }

    //a guard clause that only submits a form if it is completed
    if (!selectedCoffee) {
      return 
    }


    try {
      //then create a new data object
      const newGlobalData = {
        ...(globalData || {})
      } 

      const nowTime = Date.now()
      const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 100)
      const timestamp = nowTime - timeToSubtract


      const newData = {
        name: selectedCoffee,
        cost: coffeeCost
      }
      newGlobalData[timestamp] = newData
      //update the global state
      setGlobalData(newGlobalData)

      //persist the data in the firebase firestore
      const userRef = doc(db, 'users', globalUser.uid) //creates a reference to specific user.uid
      const res = await setDoc(userRef, { //updates firebase db for specific user (using userRef) with new entry
        [timestamp]: newData
    }, {merge: true}) //merge will tell firebase not to override the db but only merge this entry

    } catch (err) {
      console.log(err.message)
    }
    setSelectedCoffee(null)
    setHour(0)
    setMin(0)
    setCoffeeCost(0)
  }
  function handleCloseModal() {
    setShowModal(false)
  }
  return (
    <>
      {showModal && (<Modal handleCloseModal={handleCloseModal}>
        <Authentication handleCloseModal={handleCloseModal} />
      </Modal>)}
      <div className="section-header">
        <i className="fa-solid fa-pencil" />
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select coffee type</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
          return (
            <button
              onClick={() => {
                setSelectedCoffee(option.name);
                setShowCoffeeTypes(false);
              }}
              className={
                "button-card " +
                (option.name === selectedCoffee
                  ? " coffee-button-selected"
                  : " ")
              }
              key={optionIndex}
            >
              <h4>{option.name}</h4>
              <p>{option.caffeine} mg</p>
            </button>
          );
        })}
        <button
          onClick={() => {
            setShowCoffeeTypes(true);
            setSelectedCoffee(null);
          }}
          className={
            "button-card " + (showCoffeeTypes ? " coffee-button-selected" : " ")
          }
        >
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>
      {showCoffeeTypes && (
        <select
          onChange={(e) => {
            setSelectedCoffee(e.target.value);
          }}
          id="coffee-list"
          name="coffee-list"
        >
          <option value={null}>Select type</option>
          {coffeeOptions.map((option, optionIndex) => {
            return (
              <option value={option.name} key={optionIndex}>
                {option.name} ({option.caffeine}mg)
              </option>
            );
          })}
        </select>
      )}
      <h4>Add the cost ($)</h4>
      <input
        className="w-full"
        type="number"
        value={coffeeCost}
        onChange={(e) => {
          setCoffeeCost(e.target.value);
        }}
        placeholder="4.50"
      />
      <h4>Time since consumption</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select
            onChange={(e) => {
              setHour(e.target.value);
            }}
            id="hours-select"
          >
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, hourIndex) => {
              return (
                <option key={hourIndex} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <h6>Mins</h6>
          <select
            onChange={(e) => {
              setMin(e.target.value);
            }}
            id="mins-select"
          >
            {[0, 5, 10, 15, 30, 45].map((min, minIndex) => {
              return (
                <option key={minIndex} value={min}>
                  {min}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
    </>
  );
}
