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
package com.borkdominik.big.glsp.uml.unotation.impl;

import com.borkdominik.big.glsp.uml.unotation.UMLDiagram;
import com.borkdominik.big.glsp.uml.unotation.UnotationPackage;

import org.eclipse.emf.ecore.EClass;

import org.eclipse.glsp.server.emf.model.notation.impl.DiagramImpl;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>UML Diagram</b></em>'.
 * <!-- end-user-doc -->
 *
 * @generated
 */
public class UMLDiagramImpl extends DiagramImpl implements UMLDiagram {
	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	protected UMLDiagramImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	protected EClass eStaticClass() {
		return UnotationPackage.Literals.UML_DIAGRAM;
	}

} //UMLDiagramImpl
