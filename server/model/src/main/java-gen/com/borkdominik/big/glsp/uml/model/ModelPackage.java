/**
 * Copyright (c) 2024 borkdominik and others.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
package com.borkdominik.big.glsp.uml.model;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EPackage;

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
 * @see com.borkdominik.big.glsp.uml.model.ModelFactory
 * @model kind="package"
 * @generated
 */
public interface ModelPackage extends EPackage {
	/**
	 * The package name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNAME = "model";

	/**
	 * The package namespace URI.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_URI = "http://www.borkdominik.com/big-glsp/uml/model";

	/**
	 * The package namespace name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_PREFIX = "model";

	/**
	 * The singleton instance of the package.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	ModelPackage eINSTANCE = com.borkdominik.big.glsp.uml.model.impl.ModelPackageImpl.init();

	/**
	 * The meta object id for the '{@link com.borkdominik.big.glsp.uml.model.impl.NewDiagramRequestImpl <em>New Diagram Request</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see com.borkdominik.big.glsp.uml.model.impl.NewDiagramRequestImpl
	 * @see com.borkdominik.big.glsp.uml.model.impl.ModelPackageImpl#getNewDiagramRequest()
	 * @generated
	 */
	int NEW_DIAGRAM_REQUEST = 0;

	/**
	 * The feature id for the '<em><b>Diagram Type</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int NEW_DIAGRAM_REQUEST__DIAGRAM_TYPE = 0;

	/**
	 * The number of structural features of the '<em>New Diagram Request</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int NEW_DIAGRAM_REQUEST_FEATURE_COUNT = 1;

	/**
	 * The number of operations of the '<em>New Diagram Request</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int NEW_DIAGRAM_REQUEST_OPERATION_COUNT = 0;

	/**
	 * The meta object id for the '{@link com.borkdominik.big.glsp.uml.model.impl.MessageAnchorImpl <em>Message Anchor</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see com.borkdominik.big.glsp.uml.model.impl.MessageAnchorImpl
	 * @see com.borkdominik.big.glsp.uml.model.impl.ModelPackageImpl#getMessageAnchor()
	 * @generated
	 */
	int MESSAGE_ANCHOR = 1;

	/**
	 * The feature id for the '<em><b>Id</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MESSAGE_ANCHOR__ID = 0;

	/**
	 * The number of structural features of the '<em>Message Anchor</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MESSAGE_ANCHOR_FEATURE_COUNT = 1;

	/**
	 * The number of operations of the '<em>Message Anchor</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MESSAGE_ANCHOR_OPERATION_COUNT = 0;


	/**
	 * Returns the meta object for class '{@link com.borkdominik.big.glsp.uml.model.NewDiagramRequest <em>New Diagram Request</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>New Diagram Request</em>'.
	 * @see com.borkdominik.big.glsp.uml.model.NewDiagramRequest
	 * @generated
	 */
	EClass getNewDiagramRequest();

	/**
	 * Returns the meta object for the attribute '{@link com.borkdominik.big.glsp.uml.model.NewDiagramRequest#getDiagramType <em>Diagram Type</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Diagram Type</em>'.
	 * @see com.borkdominik.big.glsp.uml.model.NewDiagramRequest#getDiagramType()
	 * @see #getNewDiagramRequest()
	 * @generated
	 */
	EAttribute getNewDiagramRequest_DiagramType();

	/**
	 * Returns the meta object for class '{@link com.borkdominik.big.glsp.uml.model.MessageAnchor <em>Message Anchor</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Message Anchor</em>'.
	 * @see com.borkdominik.big.glsp.uml.model.MessageAnchor
	 * @generated
	 */
	EClass getMessageAnchor();

	/**
	 * Returns the meta object for the attribute '{@link com.borkdominik.big.glsp.uml.model.MessageAnchor#getId <em>Id</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Id</em>'.
	 * @see com.borkdominik.big.glsp.uml.model.MessageAnchor#getId()
	 * @see #getMessageAnchor()
	 * @generated
	 */
	EAttribute getMessageAnchor_Id();

	/**
	 * Returns the factory that creates the instances of the model.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the factory that creates the instances of the model.
	 * @generated
	 */
	ModelFactory getModelFactory();

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
		 * The meta object literal for the '{@link com.borkdominik.big.glsp.uml.model.impl.NewDiagramRequestImpl <em>New Diagram Request</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see com.borkdominik.big.glsp.uml.model.impl.NewDiagramRequestImpl
		 * @see com.borkdominik.big.glsp.uml.model.impl.ModelPackageImpl#getNewDiagramRequest()
		 * @generated
		 */
		EClass NEW_DIAGRAM_REQUEST = eINSTANCE.getNewDiagramRequest();

		/**
		 * The meta object literal for the '<em><b>Diagram Type</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute NEW_DIAGRAM_REQUEST__DIAGRAM_TYPE = eINSTANCE.getNewDiagramRequest_DiagramType();

		/**
		 * The meta object literal for the '{@link com.borkdominik.big.glsp.uml.model.impl.MessageAnchorImpl <em>Message Anchor</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see com.borkdominik.big.glsp.uml.model.impl.MessageAnchorImpl
		 * @see com.borkdominik.big.glsp.uml.model.impl.ModelPackageImpl#getMessageAnchor()
		 * @generated
		 */
		EClass MESSAGE_ANCHOR = eINSTANCE.getMessageAnchor();

		/**
		 * The meta object literal for the '<em><b>Id</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute MESSAGE_ANCHOR__ID = eINSTANCE.getMessageAnchor_Id();

	}

} //ModelPackage
