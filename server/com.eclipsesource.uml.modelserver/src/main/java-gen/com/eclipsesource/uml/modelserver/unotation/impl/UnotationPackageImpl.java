/**
 * Copyright (c) 2021 EclipseSource and others.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
package com.eclipsesource.uml.modelserver.unotation.impl;

import com.eclipsesource.uml.modelserver.unotation.Diagram;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.NotationElement;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import com.eclipsesource.uml.modelserver.unotation.UnotationPackage;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EEnum;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EReference;

import org.eclipse.emf.ecore.impl.EPackageImpl;

import org.eclipse.glsp.graph.GraphPackage;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model <b>Package</b>.
 * <!-- end-user-doc -->
 * @generated
 */
public class UnotationPackageImpl extends EPackageImpl implements UnotationPackage {
   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private EClass shapeEClass = null;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private EClass edgeEClass = null;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private EClass notationElementEClass = null;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private EClass diagramEClass = null;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private EClass semanticProxyEClass = null;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private EEnum representationEEnum = null;

   /**
    * Creates an instance of the model <b>Package</b>, registered with
    * {@link org.eclipse.emf.ecore.EPackage.Registry EPackage.Registry} by the package
    * package URI value.
    * <p>Note: the correct way to create the package is via the static
    * factory method {@link #init init()}, which also performs
    * initialization of the package, or returns the registered package,
    * if one already exists.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see org.eclipse.emf.ecore.EPackage.Registry
    * @see com.eclipsesource.uml.modelserver.unotation.UnotationPackage#eNS_URI
    * @see #init()
    * @generated
    */
   private UnotationPackageImpl() {
      super(eNS_URI, UnotationFactory.eINSTANCE);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private static boolean isInited = false;

   /**
    * Creates, registers, and initializes the <b>Package</b> for this model, and for any others upon which it depends.
    *
    * <p>This method is used to initialize {@link UnotationPackage#eINSTANCE} when that field is accessed.
    * Clients should not invoke it directly. Instead, they should simply access that field to obtain the package.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #eNS_URI
    * @see #createPackageContents()
    * @see #initializePackageContents()
    * @generated
    */
   public static UnotationPackage init() {
      if (isInited) return (UnotationPackage)EPackage.Registry.INSTANCE.getEPackage(UnotationPackage.eNS_URI);

      // Obtain or create and register package
      Object registeredUnotationPackage = EPackage.Registry.INSTANCE.get(eNS_URI);
      UnotationPackageImpl theUnotationPackage = registeredUnotationPackage instanceof UnotationPackageImpl ? (UnotationPackageImpl)registeredUnotationPackage : new UnotationPackageImpl();

      isInited = true;

      // Initialize simple dependencies
      GraphPackage.eINSTANCE.eClass();

      // Create package meta-data objects
      theUnotationPackage.createPackageContents();

      // Initialize created meta-data
      theUnotationPackage.initializePackageContents();

      // Mark meta-data to indicate it can't be changed
      theUnotationPackage.freeze();

      // Update the registry and return the package
      EPackage.Registry.INSTANCE.put(UnotationPackage.eNS_URI, theUnotationPackage);
      return theUnotationPackage;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EClass getShape() {
      return shapeEClass;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getShape_Position() {
      return (EReference)shapeEClass.getEStructuralFeatures().get(0);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getShape_Size() {
      return (EReference)shapeEClass.getEStructuralFeatures().get(1);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EClass getEdge() {
      return edgeEClass;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getEdge_BendPoints() {
      return (EReference)edgeEClass.getEStructuralFeatures().get(0);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getEdge_Source() {
      return (EReference)edgeEClass.getEStructuralFeatures().get(1);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getEdge_Target() {
      return (EReference)edgeEClass.getEStructuralFeatures().get(2);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EClass getNotationElement() {
      return notationElementEClass;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getNotationElement_SemanticElement() {
      return (EReference)notationElementEClass.getEStructuralFeatures().get(0);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EAttribute getNotationElement_Type() {
      return (EAttribute)notationElementEClass.getEStructuralFeatures().get(1);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EClass getDiagram() {
      return diagramEClass;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getDiagram_Elements() {
      return (EReference)diagramEClass.getEStructuralFeatures().get(0);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EAttribute getDiagram_DiagramType() {
      return (EAttribute)diagramEClass.getEStructuralFeatures().get(1);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EClass getSemanticProxy() {
      return semanticProxyEClass;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EAttribute getSemanticProxy_Uri() {
      return (EAttribute)semanticProxyEClass.getEStructuralFeatures().get(0);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getSemanticProxy_ResolvedElement() {
      return (EReference)semanticProxyEClass.getEStructuralFeatures().get(1);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EEnum getRepresentation() {
      return representationEEnum;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public UnotationFactory getUnotationFactory() {
      return (UnotationFactory)getEFactoryInstance();
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private boolean isCreated = false;

   /**
    * Creates the meta-model objects for the package.  This method is
    * guarded to have no affect on any invocation but its first.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   public void createPackageContents() {
      if (isCreated) return;
      isCreated = true;

      // Create classes and their features
      shapeEClass = createEClass(SHAPE);
      createEReference(shapeEClass, SHAPE__POSITION);
      createEReference(shapeEClass, SHAPE__SIZE);

      edgeEClass = createEClass(EDGE);
      createEReference(edgeEClass, EDGE__BEND_POINTS);
      createEReference(edgeEClass, EDGE__SOURCE);
      createEReference(edgeEClass, EDGE__TARGET);

      notationElementEClass = createEClass(NOTATION_ELEMENT);
      createEReference(notationElementEClass, NOTATION_ELEMENT__SEMANTIC_ELEMENT);
      createEAttribute(notationElementEClass, NOTATION_ELEMENT__TYPE);

      diagramEClass = createEClass(DIAGRAM);
      createEReference(diagramEClass, DIAGRAM__ELEMENTS);
      createEAttribute(diagramEClass, DIAGRAM__DIAGRAM_TYPE);

      semanticProxyEClass = createEClass(SEMANTIC_PROXY);
      createEAttribute(semanticProxyEClass, SEMANTIC_PROXY__URI);
      createEReference(semanticProxyEClass, SEMANTIC_PROXY__RESOLVED_ELEMENT);

      // Create enums
      representationEEnum = createEEnum(REPRESENTATION);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private boolean isInitialized = false;

   /**
    * Complete the initialization of the package and its meta-model.  This
    * method is guarded to have no affect on any invocation but its first.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   public void initializePackageContents() {
      if (isInitialized) return;
      isInitialized = true;

      // Initialize package
      setName(eNAME);
      setNsPrefix(eNS_PREFIX);
      setNsURI(eNS_URI);

      // Obtain other dependent packages
      GraphPackage theGraphPackage = (GraphPackage)EPackage.Registry.INSTANCE.getEPackage(GraphPackage.eNS_URI);

      // Create type parameters

      // Set bounds for type parameters

      // Add supertypes to classes
      shapeEClass.getESuperTypes().add(this.getNotationElement());
      edgeEClass.getESuperTypes().add(this.getNotationElement());
      diagramEClass.getESuperTypes().add(this.getNotationElement());

      // Initialize classes, features, and operations; add parameters
      initEClass(shapeEClass, Shape.class, "Shape", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
      initEReference(getShape_Position(), theGraphPackage.getGPoint(), null, "position", null, 0, 1, Shape.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEReference(getShape_Size(), theGraphPackage.getGDimension(), null, "size", null, 0, 1, Shape.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      initEClass(edgeEClass, Edge.class, "Edge", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
      initEReference(getEdge_BendPoints(), theGraphPackage.getGPoint(), null, "bendPoints", null, 0, -1, Edge.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEReference(getEdge_Source(), this.getNotationElement(), null, "source", null, 0, 1, Edge.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_COMPOSITE, IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEReference(getEdge_Target(), this.getNotationElement(), null, "target", null, 0, 1, Edge.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_COMPOSITE, IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      initEClass(notationElementEClass, NotationElement.class, "NotationElement", IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
      initEReference(getNotationElement_SemanticElement(), this.getSemanticProxy(), null, "semanticElement", null, 0, 1, NotationElement.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEAttribute(getNotationElement_Type(), ecorePackage.getEString(), "type", null, 0, 1, NotationElement.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      initEClass(diagramEClass, Diagram.class, "Diagram", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
      initEReference(getDiagram_Elements(), this.getNotationElement(), null, "elements", null, 0, -1, Diagram.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEAttribute(getDiagram_DiagramType(), this.getRepresentation(), "diagramType", "CLASS", 1, 1, Diagram.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      initEClass(semanticProxyEClass, SemanticProxy.class, "SemanticProxy", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
      initEAttribute(getSemanticProxy_Uri(), ecorePackage.getEString(), "uri", null, 0, 1, SemanticProxy.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEReference(getSemanticProxy_ResolvedElement(), ecorePackage.getEObject(), null, "resolvedElement", null, 0, 1, SemanticProxy.class, IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_COMPOSITE, IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      // Initialize enums and add enum literals
      initEEnum(representationEEnum, Representation.class, "Representation");
      addEEnumLiteral(representationEEnum, Representation.ACTIVITY);
      addEEnumLiteral(representationEEnum, Representation.CLASS);
      addEEnumLiteral(representationEEnum, Representation.PACKAGE);
      addEEnumLiteral(representationEEnum, Representation.SEQUENCE);
      addEEnumLiteral(representationEEnum, Representation.STATEMACHINE);
      addEEnumLiteral(representationEEnum, Representation.USECASE);
      addEEnumLiteral(representationEEnum, Representation.DEPLOYMENT);
      addEEnumLiteral(representationEEnum, Representation.COMPONENT);

      // Create resource
      createResource(eNS_URI);
   }

} //UnotationPackageImpl
