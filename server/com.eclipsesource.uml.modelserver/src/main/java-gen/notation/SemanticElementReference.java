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
package notation;

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Semantic Element Reference</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link notation.SemanticElementReference#getElementId <em>Element Id</em>}</li>
 *   <li>{@link notation.SemanticElementReference#getResolvedSemanticElement <em>Resolved Semantic Element</em>}</li>
 * </ul>
 *
 * @see notation.NotationPackage#getSemanticElementReference()
 * @model
 * @generated
 */
public interface SemanticElementReference extends EObject {
   /**
    * Returns the value of the '<em><b>Element Id</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Element Id</em>' attribute.
    * @see #setElementId(String)
    * @see notation.NotationPackage#getSemanticElementReference_ElementId()
    * @model
    * @generated
    */
   String getElementId();

   /**
    * Sets the value of the '{@link notation.SemanticElementReference#getElementId <em>Element Id</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Element Id</em>' attribute.
    * @see #getElementId()
    * @generated
    */
   void setElementId(String value);

   /**
    * Returns the value of the '<em><b>Resolved Semantic Element</b></em>' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Resolved Semantic Element</em>' reference.
    * @see #setResolvedSemanticElement(EObject)
    * @see notation.NotationPackage#getSemanticElementReference_ResolvedSemanticElement()
    * @model transient="true"
    * @generated
    */
   EObject getResolvedSemanticElement();

   /**
    * Sets the value of the '{@link notation.SemanticElementReference#getResolvedSemanticElement <em>Resolved Semantic Element</em>}' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Resolved Semantic Element</em>' reference.
    * @see #getResolvedSemanticElement()
    * @generated
    */
   void setResolvedSemanticElement(EObject value);

} // SemanticElementReference
