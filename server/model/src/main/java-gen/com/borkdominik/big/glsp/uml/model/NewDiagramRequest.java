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

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>New Diagram Request</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link com.borkdominik.big.glsp.uml.model.NewDiagramRequest#getDiagramType <em>Diagram Type</em>}</li>
 * </ul>
 *
 * @see com.borkdominik.big.glsp.uml.model.ModelPackage#getNewDiagramRequest()
 * @model
 * @generated
 */
public interface NewDiagramRequest extends EObject {
	/**
	 * Returns the value of the '<em><b>Diagram Type</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Diagram Type</em>' attribute.
	 * @see #setDiagramType(String)
	 * @see com.borkdominik.big.glsp.uml.model.ModelPackage#getNewDiagramRequest_DiagramType()
	 * @model
	 * @generated
	 */
	String getDiagramType();

	/**
	 * Sets the value of the '{@link com.borkdominik.big.glsp.uml.model.NewDiagramRequest#getDiagramType <em>Diagram Type</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Diagram Type</em>' attribute.
	 * @see #getDiagramType()
	 * @generated
	 */
	void setDiagramType(String value);

} // NewDiagramRequest
