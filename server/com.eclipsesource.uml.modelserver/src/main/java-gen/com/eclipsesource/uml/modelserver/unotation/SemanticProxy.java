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

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Semantic Proxy</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getUri <em>Uri</em>}</li>
 *   <li>{@link com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getResolvedElement <em>Resolved Element</em>}</li>
 * </ul>
 *
 * @see com.eclipsesource.uml.modelserver.unotation.UnotationPackage#getSemanticProxy()
 * @model
 * @generated
 */
public interface SemanticProxy extends EObject {
   /**
    * Returns the value of the '<em><b>Uri</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Uri</em>' attribute.
    * @see #setUri(String)
    * @see com.eclipsesource.uml.modelserver.unotation.UnotationPackage#getSemanticProxy_Uri()
    * @model
    * @generated
    */
   String getUri();

   /**
    * Sets the value of the '{@link com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getUri <em>Uri</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Uri</em>' attribute.
    * @see #getUri()
    * @generated
    */
   void setUri(String value);

   /**
    * Returns the value of the '<em><b>Resolved Element</b></em>' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Resolved Element</em>' reference.
    * @see #setResolvedElement(EObject)
    * @see com.eclipsesource.uml.modelserver.unotation.UnotationPackage#getSemanticProxy_ResolvedElement()
    * @model transient="true"
    * @generated
    */
   EObject getResolvedElement();

   /**
    * Sets the value of the '{@link com.eclipsesource.uml.modelserver.unotation.SemanticProxy#getResolvedElement <em>Resolved Element</em>}' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Resolved Element</em>' reference.
    * @see #getResolvedElement()
    * @generated
    */
   void setResolvedElement(EObject value);

} // SemanticProxy
