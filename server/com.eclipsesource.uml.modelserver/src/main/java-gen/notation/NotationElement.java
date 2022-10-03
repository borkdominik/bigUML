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
 * A representation of the model object '<em><b>Element</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link notation.NotationElement#getSemanticElement <em>Semantic Element</em>}</li>
 *   <li>{@link notation.NotationElement#getType <em>Type</em>}</li>
 * </ul>
 *
 * @see notation.NotationPackage#getNotationElement()
 * @model abstract="true"
 * @generated
 */
public interface NotationElement extends EObject {
   /**
    * Returns the value of the '<em><b>Semantic Element</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Semantic Element</em>' containment reference.
    * @see #setSemanticElement(SemanticElementReference)
    * @see notation.NotationPackage#getNotationElement_SemanticElement()
    * @model containment="true"
    * @generated
    */
   SemanticElementReference getSemanticElement();

   /**
    * Sets the value of the '{@link notation.NotationElement#getSemanticElement <em>Semantic Element</em>}' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Semantic Element</em>' containment reference.
    * @see #getSemanticElement()
    * @generated
    */
   void setSemanticElement(SemanticElementReference value);

   /**
    * Returns the value of the '<em><b>Type</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Type</em>' attribute.
    * @see #setType(String)
    * @see notation.NotationPackage#getNotationElement_Type()
    * @model
    * @generated
    */
   String getType();

   /**
    * Sets the value of the '{@link notation.NotationElement#getType <em>Type</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Type</em>' attribute.
    * @see #getType()
    * @generated
    */
   void setType(String value);

} // NotationElement
