import React, { useState, useEffect } from 'react';
import * as api from './api/apiService';
import Spinner from './components/Spinner';
import GradesControl from './components/GradesControl';
import ModalGrade from './components/ModalGrade';

export default function App() {
  //hook
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getGrades = async () => {
      const grades = await api.getAllGrades();
      setTimeout(() => {
        //força o carregamento da página
        setAllGrades(grades);
      }, 2000);
    };
    // api.getAllGrades().then((grades) => {
    //   setTimeout(() => {
    //     //força o carregamento da página
    //     setAllGrades(grades);
    //   }, 2000);
    // });
    getGrades();
  }, []);

  const handleDelete = async (gradeDelete) => {
    const isDeleted = await api.deleteGrade(gradeDelete);

    if (isDeleted) {
      //verifica o ID para ser deletado
      const deletedGradeIndex = allGrades.findIndex(
        (grade) => grade.id === gradeDelete.id
      );
      //realiza uma cópia e substitui no front o valor da nota por 0
      const newGrades = Object.assign([], allGrades);
      newGrades[deletedGradeIndex].isDeleted = true;
      newGrades[deletedGradeIndex].value = 0;

      setAllGrades(newGrades);
    }
  };
  const handlePersist = (grade) => {
    setSelectedGrades(grade);
    setModalOpen(true);
  };
  const handlePersistData = async (formData) => {
    const { id, newValue } = formData;
    const newGrades = Object.assign([], allGrades);
    const gradeToPersist = newGrades.find((grade) => grade.id === id);

    gradeToPersist.value = newValue;

    if (gradeToPersist.isDeleted) {
      gradeToPersist.isDeleted = false;
      await api.insertGrade(gradeToPersist);
    } else {
      await api.updateGrade(gradeToPersist);
    }

    setModalOpen(false);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <h1 className="center">Controle de notas</h1>

      {allGrades.length === 0 && <Spinner />}
      {allGrades.length > 0 && (
        <GradesControl
          grades={allGrades}
          onDelete={handleDelete}
          onPersist={handlePersist}
        />
      )}
      {isModalOpen && (
        <ModalGrade
          onSave={handlePersistData}
          onClose={handleClose}
          selectedGrades={selectedGrades}
        />
      )}
    </div>
  );
}
