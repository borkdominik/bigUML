/**
 * Copyright (c) 2022 EclipseSource and others.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
package com.eclipsesource.uml.modelserver.model;

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Message Anchor</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link com.eclipsesource.uml.modelserver.model.MessageAnchor#getId <em>Id</em>}</li>
 * </ul>
 *
 * @see com.eclipsesource.uml.modelserver.model.ModelPackage#getMessageAnchor()
 * @model
 * @generated
 */
public interface MessageAnchor extends EObject {

   /**
    * Returns the value of the '<em><b>Id</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Id</em>' attribute.
    * @see #setId(String)
    * @see com.eclipsesource.uml.modelserver.model.ModelPackage#getMessageAnchor_Id()
    * @model
    * @generated
    */
   String getId();

   /**
    * Sets the value of the '{@link com.eclipsesource.uml.modelserver.model.MessageAnchor#getId <em>Id</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Id</em>' attribute.
    * @see #getId()
    * @generated
    */
   void setId(String value);
} // MessageAnchor
