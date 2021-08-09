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
package com.eclipsesource.uml.modelserver.unotation;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EEnum;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EReference;

/**
 * <!-- begin-user-doc -->
 * The <b>Package</b> for the model.
 * It contains accessors for the meta objects to represent
 * <ul>
 *   <li>each class,</li>
 *   <li>each feature of each class,</li>
 *   <li>each operation of each class,</li>
 *   <li>each enum,</li>
 *   <li>and each data type</li>
 * </ul>
 * <!-- end-user-doc -->
 * @see com.eclipsesource.uml.modelserver.unotation.UnotationFactory
 * @model kind="package"
 * @generated
 */
public interface UnotationPackage extends EPackage {
   /**
    * The package name.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   String eNAME = "unotation";

   /**
    * The package namespace URI.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   String eNS_URI = "http://www.eclipsesource.com/glsp/uml/notation";

   /**
    * The package namespace name.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   String eNS_PREFIX = "unotation";

   /**
    * The singleton instance of the package.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   UnotationPackage eINSTANCE = com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl.init();

   /**
    * The meta object id for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.NotationElementImpl <em>Notation Element</em>}' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see com.eclipsesource.uml.modelserver.unotation.impl.NotationElementImpl
    * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getNotationElement()
    * @generated
    */
   int NOTATION_ELEMENT = 2;

   /**
    * The feature id for the '<em><b>Semantic Element</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int NOTATION_ELEMENT__SEMANTIC_ELEMENT = 0;

   /**
    * The feature id for the '<em><b>Type</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int NOTATION_ELEMENT__TYPE = 1;

   /**
    * The number of structural features of the '<em>Notation Element</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int NOTATION_ELEMENT_FEATURE_COUNT = 2;

   /**
    * The number of operations of the '<em>Notation Element</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int NOTATION_ELEMENT_OPERATION_COUNT = 0;

   /**
    * The meta object id for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.ShapeImpl <em>Shape</em>}' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see com.eclipsesource.uml.modelserver.unotation.impl.ShapeImpl
    * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getShape()
    * @generated
    */
   int SHAPE = 0;

   /**
    * The feature id for the '<em><b>Semantic Element</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SHAPE__SEMANTIC_ELEMENT = NOTATION_ELEMENT__SEMANTIC_ELEMENT;

   /**
    * The feature id for the '<em><b>Type</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SHAPE__TYPE = NOTATION_ELEMENT__TYPE;

   /**
    * The feature id for the '<em><b>Position</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SHAPE__POSITION = NOTATION_ELEMENT_FEATURE_COUNT + 0;

   /**
    * The feature id for the '<em><b>Size</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SHAPE__SIZE = NOTATION_ELEMENT_FEATURE_COUNT + 1;

   /**
    * The number of structural features of the '<em>Shape</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SHAPE_FEATURE_COUNT = NOTATION_ELEMENT_FEATURE_COUNT + 2;

   /**
    * The number of operations of the '<em>Shape</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SHAPE_OPERATION_COUNT = NOTATION_ELEMENT_OPERATION_COUNT + 0;

   /**
    * The meta object id for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.EdgeImpl <em>Edge</em>}' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see com.eclipsesource.uml.modelserver.unotation.impl.EdgeImpl
    * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getEdge()
    * @generated
    */
   int EDGE = 1;

   /**
    * The feature id for the '<em><b>Semantic Element</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int EDGE__SEMANTIC_ELEMENT = NOTATION_ELEMENT__SEMANTIC_ELEMENT;

   /**
    * The feature id for the '<em><b>Type</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int EDGE__TYPE = NOTATION_ELEMENT__TYPE;

   /**
    * The feature id for the '<em><b>Bend Points</b></em>' containment reference list.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int EDGE__BEND_POINTS = NOTATION_ELEMENT_FEATURE_COUNT + 0;

   /**
    * The feature id for the '<em><b>Source</b></em>' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int EDGE__SOURCE = NOTATION_ELEMENT_FEATURE_COUNT + 1;

   /**
    * The feature id for the '<em><b>Target</b></em>' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int EDGE__TARGET = NOTATION_ELEMENT_FEATURE_COUNT + 2;

   /**
    * The number of structural features of the '<em>Edge</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int EDGE_FEATURE_COUNT = NOTATION_ELEMENT_FEATURE_COUNT + 3;

   /**
    * The number of operations of the '<em>Edge</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int EDGE_OPERATION_COUNT = NOTATION_ELEMENT_OPERATION_COUNT + 0;

   /**
    * The meta object id for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.DiagramImpl <em>Diagram</em>}' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see com.eclipsesource.uml.modelserver.unotation.impl.DiagramImpl
    * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getDiagram()
    * @generated
    */
   int DIAGRAM = 3;

   /**
    * The feature id for the '<em><b>Semantic Element</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int DIAGRAM__SEMANTIC_ELEMENT = NOTATION_ELEMENT__SEMANTIC_ELEMENT;

   /**
    * The feature id for the '<em><b>Type</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int DIAGRAM__TYPE = NOTATION_ELEMENT__TYPE;

   /**
    * The feature id for the '<em><b>Elements</b></em>' containment reference list.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int DIAGRAM__ELEMENTS = NOTATION_ELEMENT_FEATURE_COUNT + 0;

   /**
    * The feature id for the '<em><b>Diagram Type</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int DIAGRAM__DIAGRAM_TYPE = NOTATION_ELEMENT_FEATURE_COUNT + 1;

   /**
    * The number of structural features of the '<em>Diagram</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int DIAGRAM_FEATURE_COUNT = NOTATION_ELEMENT_FEATURE_COUNT + 2;

   /**
    * The number of operations of the '<em>Diagram</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int DIAGRAM_OPERATION_COUNT = NOTATION_ELEMENT_OPERATION_COUNT + 0;

   /**
    * The meta object id for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.SemanticProxyImpl <em>Semantic Proxy</em>}' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see com.eclipsesource.uml.modelserver.unotation.impl.SemanticProxyImpl
    * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getSemanticProxy()
    * @generated
    */
   int SEMANTIC_PROXY = 4;

   /**
    * The feature id for the '<em><b>Uri</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SEMANTIC_PROXY__URI = 0;

   /**
    * The feature id for the '<em><b>Resolved Element</b></em>' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SEMANTIC_PROXY__RESOLVED_ELEMENT = 1;

   /**
    * The number of structural features of the '<em>Semantic Proxy</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SEMANTIC_PROXY_FEATURE_COUNT = 2;

   /**
    * The number of operations of the '<em>Semantic Proxy</em>' class.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    * @ordered
    */
   int SEMANTIC_PROXY_OPERATION_COUNT = 0;

   /**
    * The meta object id for the '{@link com.eclipsesource.uml.modelserver.unotation.Representation <em>Representation</em>}' enum.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see com.eclipsesource.uml.modelserver.unotation.Representation
    * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getRepresentation()
    * @generated
    */
   int REPRESENTATION = 5;


   /**
    * Returns the meta object for class '{@link com.eclipsesource.uml.modelserver.unotation.Shape <em>Shape</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for class '<em>Shape</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Shape
    * @generated
    */
   EClass getShape();

   /**
    * Returns the meta object for the containment reference '{@link com.eclipsesource.uml.modelserver.unotation.Shape#getPosition <em>Position</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the containment reference '<em>Position</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Shape#getPosition()
    * @see #getShape()
    * @generated
    */
   EReference getShape_Position();

   /**
    * Returns the meta object for the containment reference '{@link com.eclipsesource.uml.modelserver.unotation.Shape#getSize <em>Size</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the containment reference '<em>Size</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Shape#getSize()
    * @see #getShape()
    * @generated
    */
   EReference getShape_Size();

   /**
    * Returns the meta object for class '{@link com.eclipsesource.uml.modelserver.unotation.Edge <em>Edge</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for class '<em>Edge</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Edge
    * @generated
    */
   EClass getEdge();

   /**
    * Returns the meta object for the containment reference list '{@link com.eclipsesource.uml.modelserver.unotation.Edge#getBendPoints <em>Bend Points</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the containment reference list '<em>Bend Points</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Edge#getBendPoints()
    * @see #getEdge()
    * @generated
    */
   EReference getEdge_BendPoints();

   /**
    * Returns the meta object for the reference '{@link com.eclipsesource.uml.modelserver.unotation.Edge#getSource <em>Source</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the reference '<em>Source</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Edge#getSource()
    * @see #getEdge()
    * @generated
    */
   EReference getEdge_Source();

   /**
    * Returns the meta object for the reference '{@link com.eclipsesource.uml.modelserver.unotation.Edge#getTarget <em>Target</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the reference '<em>Target</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Edge#getTarget()
    * @see #getEdge()
    * @generated
    */
   EReference getEdge_Target();

   /**
    * Returns the meta object for class '{@link com.eclipsesource.uml.modelserver.unotation.NotationElement <em>Notation Element</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for class '<em>Notation Element</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.NotationElement
    * @generated
    */
   EClass getNotationElement();

   /**
    * Returns the meta object for the containment reference '{@link com.eclipsesource.uml.modelserver.unotation.NotationElement#getSemanticElement <em>Semantic Element</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the containment reference '<em>Semantic Element</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.NotationElement#getSemanticElement()
    * @see #getNotationElement()
    * @generated
    */
   EReference getNotationElement_SemanticElement();

   /**
    * Returns the meta object for the attribute '{@link com.eclipsesource.uml.modelserver.unotation.NotationElement#getType <em>Type</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the attribute '<em>Type</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.NotationElement#getType()
    * @see #getNotationElement()
    * @generated
    */
   EAttribute getNotationElement_Type();

   /**
    * Returns the meta object for class '{@link com.eclipsesource.uml.modelserver.unotation.Diagram <em>Diagram</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for class '<em>Diagram</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Diagram
    * @generated
    */
   EClass getDiagram();

   /**
    * Returns the meta object for the containment reference list '{@link com.eclipsesource.uml.modelserver.unotation.Diagram#getElements <em>Elements</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the containment reference list '<em>Elements</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Diagram#getElements()
    * @see #getDiagram()
    * @generated
    */
   EReference getDiagram_Elements();

   /**
    * Returns the meta object for the attribute '{@link com.eclipsesource.uml.modelserver.unotation.Diagram#getDiagramType <em>Diagram Type</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the attribute '<em>Diagram Type</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Diagram#getDiagramType()
    * @see #getDiagram()
    * @generated
    */
   EAttribute getDiagram_DiagramType();

   /**
    * Returns the meta object for class '{@link com.eclipsesource.uml.modelserver.unotation.SemanticProxy <em>Semantic Proxy</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for class '<em>Semantic Proxy</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.SemanticProxy
    * @generated
    */
   EClass getSemanticProxy();

   /**
    * Returns the meta object for the attribute '{@link com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getUri <em>Uri</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the attribute '<em>Uri</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getUri()
    * @see #getSemanticProxy()
    * @generated
    */
   EAttribute getSemanticProxy_Uri();

   /**
    * Returns the meta object for the reference '{@link com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getResolvedElement <em>Resolved Element</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for the reference '<em>Resolved Element</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getResolvedElement()
    * @see #getSemanticProxy()
    * @generated
    */
   EReference getSemanticProxy_ResolvedElement();

   /**
    * Returns the meta object for enum '{@link com.eclipsesource.uml.modelserver.unotation.Representation <em>Representation</em>}'.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the meta object for enum '<em>Representation</em>'.
    * @see com.eclipsesource.uml.modelserver.unotation.Representation
    * @generated
    */
   EEnum getRepresentation();

   /**
    * Returns the factory that creates the instances of the model.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the factory that creates the instances of the model.
    * @generated
    */
   UnotationFactory getUnotationFactory();

   /**
    * <!-- begin-user-doc -->
    * Defines literals for the meta objects that represent
    * <ul>
    *   <li>each class,</li>
    *   <li>each feature of each class,</li>
    *   <li>each operation of each class,</li>
    *   <li>each enum,</li>
    *   <li>and each data type</li>
    * </ul>
    * <!-- end-user-doc -->
    * @generated
    */
   interface Literals {
      /**
       * The meta object literal for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.ShapeImpl <em>Shape</em>}' class.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @see com.eclipsesource.uml.modelserver.unotation.impl.ShapeImpl
       * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getShape()
       * @generated
       */
      EClass SHAPE = eINSTANCE.getShape();

      /**
       * The meta object literal for the '<em><b>Position</b></em>' containment reference feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference SHAPE__POSITION = eINSTANCE.getShape_Position();

      /**
       * The meta object literal for the '<em><b>Size</b></em>' containment reference feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference SHAPE__SIZE = eINSTANCE.getShape_Size();

      /**
       * The meta object literal for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.EdgeImpl <em>Edge</em>}' class.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @see com.eclipsesource.uml.modelserver.unotation.impl.EdgeImpl
       * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getEdge()
       * @generated
       */
      EClass EDGE = eINSTANCE.getEdge();

      /**
       * The meta object literal for the '<em><b>Bend Points</b></em>' containment reference list feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference EDGE__BEND_POINTS = eINSTANCE.getEdge_BendPoints();

      /**
       * The meta object literal for the '<em><b>Source</b></em>' reference feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference EDGE__SOURCE = eINSTANCE.getEdge_Source();

      /**
       * The meta object literal for the '<em><b>Target</b></em>' reference feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference EDGE__TARGET = eINSTANCE.getEdge_Target();

      /**
       * The meta object literal for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.NotationElementImpl <em>Notation Element</em>}' class.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @see com.eclipsesource.uml.modelserver.unotation.impl.NotationElementImpl
       * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getNotationElement()
       * @generated
       */
      EClass NOTATION_ELEMENT = eINSTANCE.getNotationElement();

      /**
       * The meta object literal for the '<em><b>Semantic Element</b></em>' containment reference feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference NOTATION_ELEMENT__SEMANTIC_ELEMENT = eINSTANCE.getNotationElement_SemanticElement();

      /**
       * The meta object literal for the '<em><b>Type</b></em>' attribute feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EAttribute NOTATION_ELEMENT__TYPE = eINSTANCE.getNotationElement_Type();

      /**
       * The meta object literal for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.DiagramImpl <em>Diagram</em>}' class.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @see com.eclipsesource.uml.modelserver.unotation.impl.DiagramImpl
       * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getDiagram()
       * @generated
       */
      EClass DIAGRAM = eINSTANCE.getDiagram();

      /**
       * The meta object literal for the '<em><b>Elements</b></em>' containment reference list feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference DIAGRAM__ELEMENTS = eINSTANCE.getDiagram_Elements();

      /**
       * The meta object literal for the '<em><b>Diagram Type</b></em>' attribute feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EAttribute DIAGRAM__DIAGRAM_TYPE = eINSTANCE.getDiagram_DiagramType();

      /**
       * The meta object literal for the '{@link com.eclipsesource.uml.modelserver.unotation.impl.SemanticProxyImpl <em>Semantic Proxy</em>}' class.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @see com.eclipsesource.uml.modelserver.unotation.impl.SemanticProxyImpl
       * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getSemanticProxy()
       * @generated
       */
      EClass SEMANTIC_PROXY = eINSTANCE.getSemanticProxy();

      /**
       * The meta object literal for the '<em><b>Uri</b></em>' attribute feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EAttribute SEMANTIC_PROXY__URI = eINSTANCE.getSemanticProxy_Uri();

      /**
       * The meta object literal for the '<em><b>Resolved Element</b></em>' reference feature.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @generated
       */
      EReference SEMANTIC_PROXY__RESOLVED_ELEMENT = eINSTANCE.getSemanticProxy_ResolvedElement();

      /**
       * The meta object literal for the '{@link com.eclipsesource.uml.modelserver.unotation.Representation <em>Representation</em>}' enum.
       * <!-- begin-user-doc -->
       * <!-- end-user-doc -->
       * @see com.eclipsesource.uml.modelserver.unotation.Representation
       * @see com.eclipsesource.uml.modelserver.unotation.impl.UnotationPackageImpl#getRepresentation()
       * @generated
       */
      EEnum REPRESENTATION = eINSTANCE.getRepresentation();

   }

} //UnotationPackage
