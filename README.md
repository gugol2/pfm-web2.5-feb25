# **Proyecto de Automatización con Hyperledger Besu y Docker**

## **Motivación**

El propósito de este proyecto es automatizar la creación y gestión de una red blockchain basada en **Hyperledger Besu**, utilizando **Docker** para desplegar nodos y facilitando su interacción mediante una API REST y una interfaz gráfica. Se busca profundizar en el funcionamiento de los nodos Hyperledger Besu, la creación de redes internas de Docker y su administración programática mediante scripts y TypeScript.

## **Tecnologías Utilizadas**

- **Frontend:** React (NextJS)
- **Backend:** NodeJS con TypeScript
- **Contenedorización:** Docker o Kubernetes (K8S)
- **Blockchain Framework:** Hyperledger Besu con el protocolo Clique
- **Sistema Operativo:** Linux, MacOS o WSL en Windows

## **Entendimiento Técnico**

### **Funcionamiento de un Nodo Hyperledger Besu**

Hyperledger Besu es un cliente Ethereum compatible con EVM que permite la ejecución de redes blockchain privadas y públicas. En este proyecto se usará el protocolo **Clique (Proof of Authority)** para la validación de transacciones.

### **Redes Internas de Docker**

Docker permite la creación de redes internas aisladas, facilitando la comunicación entre los distintos contenedores que alojarán los nodos de la red blockchain.

### **Uso Programático de Docker**

Se desarrollará una biblioteca en TypeScript que permita la gestión programática de los nodos mediante comandos Docker.

## **Niveles de Implementación**

### **Nivel 1 (2 puntos)**

- Implementar un script que despliegue múltiples nodos a través de comandos Docker.
- **Entregable:** Script `script.sh` que cree la red y la pruebe realizando transacciones.

### **Nivel 2 (3 puntos)**

- Desarrollo de una **biblioteca en TypeScript** que facilite la creación y administración de redes y nodos.
- Creación de pruebas automatizadas para validar los nodos.
- **Entregable:** Código de la biblioteca con pruebas exitosas.

### **Nivel 3 (2 puntos)**

- Desarrollo de una API REST con **NextJS en TypeScript** que utilice la biblioteca creada en el nivel 2.
- Funcionalidades:
  - Crear y eliminar redes.
  - Agregar y remover nodos.
- **Entregable:** Código del backend.

### **Nivel 4 (2 puntos)**

- Desarrollo de un **frontend** en el mismo proyecto que use la API REST para manejar la creación de redes y nodos.
- **Entregable:** Código del frontend.

## **Organización del Proyecto**

### **Estructura de Archivos**

```
📂 Proyecto
 ├── 📂 script        # Script de despliegue
 │    └── script.sh
 ├── 📂 lib           # Biblioteca en TypeScript
 │    └── index.ts
 ├── 📂 frontback     # Framework NextJS
 │    ├── 📂 src
 │    │    └──
 │    ...
 ├── README.md        # Instrucciones de instalación, uso y Video Demo
 └── ...
```

### **Componentes**

- **Script:** Contendrá `script.sh` con los pasos para desplegar y probar la red.
- **Biblioteca:** Código de TypeScript con lógica de gestión de nodos y pruebas.
- **Backend:** API REST desarrollada en NextJS que interactúa con la biblioteca.
- **Frontend:** Interfaz gráfica que consume la API REST para gestionar la red.

---

## **Niveles y Objetivos Adicionales**

**Nivel 1**

- Automatizar completamente la creación de la red.
- Implementar un API REST conectado al backend.
- Incluir un **video demo** y un **README** explicativo.

**Nivel 2**

- Desarrollo de un frontend con:
  - Faucet
  - Explorer
  - Métodos de transferencia y balance

**Nivel 3**

- Desplegar el proyecto en **producción**.

**Nivel 4**

- Desarrollar un **CLI**.

---

## **Revisión y Evaluación**

### **Sprint 1 Review (10 min)**

- Demostración de funcionalidades.
- Presentación del progreso basado en el README (N1-N3).

### **Presentación Final (20 min)**

- Demostración de funcionalidades (N1-N5) – 10 min.
- **Retrospectiva** – 5 min.
- **Comentarios finales y feedback** – 5 min.

## **Normas Generales**

1. **Enlace al Video Demo**

   - Debe incluirse en el README del proyecto.

2. **Deadline de Commits**

   - Fecha límite estricta: **Cada commit posterior restará 0.5 puntos.**

3. **Progreso por Niveles**
   - No avanzar al siguiente nivel sin completar el anterior al 100%.
