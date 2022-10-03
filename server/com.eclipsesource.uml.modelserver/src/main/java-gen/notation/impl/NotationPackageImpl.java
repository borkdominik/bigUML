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
package notation.impl;

import com.eclipsesource.uml.modelserver.unotation.UnotationPackage;

import com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl;

import notation.Diagram;
import notation.Edge;
import notation.NotationElement;
import notation.NotationFactory;
import notation.NotationPackage;
import notation.SemanticElementReference;
import notation.Shape;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
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
public class NotationPackageImpl extends EPackageImpl implements NotationPackage {
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
   private EClass semanticElementReferenceEClass = null;

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
    * @see notation.NotationPackage#eNS_URI
    * @see #init()
    * @generated
    */
   private NotationPackageImpl() {
      super(eNS_URI, NotationFactory.eINSTANCE);
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
    * <p>This method is used to initialize {@link NotationPackage#eINSTANCE} when that field is accessed.
    * Clients should not invoke it directly. Instead, they should simply access that field to obtain the package.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #eNS_URI
    * @see #createPackageContents()
    * @see #initializePackageContents()
    * @generated
    */
   public static NotationPackage init() {
      if (isInited) return (NotationPackage)EPackage.Registry.INSTANCE.getEPackage(NotationPackage.eNS_URI);

      // Obtain or create and register package
      Object registeredNotationPackage = EPackage.Registry.INSTANCE.get(eNS_URI);
      NotationPackageImpl theNotationPackage = registeredNotationPackage instanceof NotationPackageImpl ? (NotationPackageImpl)registeredNotationPackage : new NotationPackageImpl();

      isInited = true;

      // Initialize simple dependencies
      GraphPackage.eINSTANCE.eClass();

      // Obtain or create and register interdependencies
      Object registeredPackage = EPackage.Registry.INSTANCE.getEPackage(UnotationPackage.eNS_URI);
      UnotationPackageImpl theUnotationPackage = (UnotationPackageImpl)(registeredPackage instanceof UnotationPackageImpl ? registeredPackage : UnotationPackage.eINSTANCE);

      // Create package meta-data objects
      theNotationPackage.createPackageContents();
      theUnotationPackage.createPackageContents();

      // Initialize created meta-data
      theNotationPackage.initializePackageContents();
      theUnotationPackage.initializePackageContents();

      // Mark meta-data to indicate it can't be changed
      theNotationPackage.freeze();

      // Update the registry and return the package
      EPackage.Registry.INSTANCE.put(NotationPackage.eNS_URI, theNotationPackage);
      return theNotationPackage;
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
   public EClass getSemanticElementReference() {
      return semanticElementReferenceEClass;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EAttribute getSemanticElementReference_ElementId() {
      return (EAttribute)semanticElementReferenceEClass.getEStructuralFeatures().get(0);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EReference getSemanticElementReference_ResolvedSemanticElement() {
      return (EReference)semanticElementReferenceEClass.getEStructuralFeatures().get(1);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public NotationFactory getNotationFactory() {
      return (NotationFactory)getEFactoryInstance();
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

      semanticElementReferenceEClass = createEClass(SEMANTIC_ELEMENT_REFERENCE);
      createEAttribute(semanticElementReferenceEClass, SEMANTIC_ELEMENT_REFERENCE__ELEMENT_ID);
      createEReference(semanticElementReferenceEClass, SEMANTIC_ELEMENT_REFERENCE__RESOLVED_SEMANTIC_ELEMENT);
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
      initEReference(getNotationElement_SemanticElement(), this.getSemanticElementReference(), null, "semanticElement", null, 0, 1, NotationElement.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEAttribute(getNotationElement_Type(), ecorePackage.getEString(), "type", null, 0, 1, NotationElement.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      initEClass(diagramEClass, Diagram.class, "Diagram", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
      initEReference(getDiagram_Elements(), this.getNotationElement(), null, "elements", null, 0, -1, Diagram.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEAttribute(getDiagram_DiagramType(), ecorePackage.getEString(), "diagramType", null, 0, 1, Diagram.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      initEClass(semanticElementReferenceEClass, SemanticElementReference.class, "SemanticElementReference", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
      initEAttribute(getSemanticElementReference_ElementId(), ecorePackage.getEString(), "elementId", null, 0, 1, SemanticElementReference.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
      initEReference(getSemanticElementReference_ResolvedSemanticElement(), ecorePackage.getEObject(), null, "resolvedSemanticElement", null, 0, 1, SemanticElementReference.class, IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_COMPOSITE, IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

      // Create resource
      createResource(eNS_URI);
   }

} //NotationPackageImpl
