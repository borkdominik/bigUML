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
package com.borkdominik.big.glsp.uml.model.impl;

import com.borkdominik.big.glsp.uml.model.ModelPackage;
import com.borkdominik.big.glsp.uml.model.NewDiagramRequest;

import org.eclipse.emf.common.notify.Notification;

import org.eclipse.emf.ecore.EClass;

import org.eclipse.emf.ecore.impl.ENotificationImpl;
import org.eclipse.emf.ecore.impl.MinimalEObjectImpl;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>New Diagram Request</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link com.borkdominik.big.glsp.uml.model.impl.NewDiagramRequestImpl#getDiagramType <em>Diagram Type</em>}</li>
 * </ul>
 *
 * @generated
 */
public class NewDiagramRequestImpl extends MinimalEObjectImpl.Container implements NewDiagramRequest {
	/**
	 * The default value of the '{@link #getDiagramType() <em>Diagram Type</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getDiagramType()
	 * @generated
	 * @ordered
	 */
	protected static final String DIAGRAM_TYPE_EDEFAULT = null;

	/**
	 * The cached value of the '{@link #getDiagramType() <em>Diagram Type</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getDiagramType()
	 * @generated
	 * @ordered
	 */
	protected String diagramType = DIAGRAM_TYPE_EDEFAULT;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	protected NewDiagramRequestImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	protected EClass eStaticClass() {
		return ModelPackage.Literals.NEW_DIAGRAM_REQUEST;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String getDiagramType() {
		return diagramType;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setDiagramType(String newDiagramType) {
		String oldDiagramType = diagramType;
		diagramType = newDiagramType;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, ModelPackage.NEW_DIAGRAM_REQUEST__DIAGRAM_TYPE, oldDiagramType, diagramType));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Object eGet(int featureID, boolean resolve, boolean coreType) {
		switch (featureID) {
			case ModelPackage.NEW_DIAGRAM_REQUEST__DIAGRAM_TYPE:
				return getDiagramType();
		}
		return super.eGet(featureID, resolve, coreType);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void eSet(int featureID, Object newValue) {
		switch (featureID) {
			case ModelPackage.NEW_DIAGRAM_REQUEST__DIAGRAM_TYPE:
				setDiagramType((String)newValue);
				return;
		}
		super.eSet(featureID, newValue);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void eUnset(int featureID) {
		switch (featureID) {
			case ModelPackage.NEW_DIAGRAM_REQUEST__DIAGRAM_TYPE:
				setDiagramType(DIAGRAM_TYPE_EDEFAULT);
				return;
		}
		super.eUnset(featureID);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public boolean eIsSet(int featureID) {
		switch (featureID) {
			case ModelPackage.NEW_DIAGRAM_REQUEST__DIAGRAM_TYPE:
				return DIAGRAM_TYPE_EDEFAULT == null ? diagramType != null : !DIAGRAM_TYPE_EDEFAULT.equals(diagramType);
		}
		return super.eIsSet(featureID);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String toString() {
		if (eIsProxy()) return super.toString();

		StringBuilder result = new StringBuilder(super.toString());
		result.append(" (diagramType: ");
		result.append(diagramType);
		result.append(')');
		return result.toString();
	}

} //NewDiagramRequestImpl
