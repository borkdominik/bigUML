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

import org.eclipse.emf.common.util.EList;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Diagram</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link notation.Diagram#getElements <em>Elements</em>}</li>
 *   <li>{@link notation.Diagram#getDiagramType <em>Diagram Type</em>}</li>
 * </ul>
 *
 * @see notation.NotationPackage#getDiagram()
 * @model
 * @generated
 */
public interface Diagram extends NotationElement {
   /**
    * Returns the value of the '<em><b>Elements</b></em>' containment reference list.
    * The list contents are of type {@link notation.NotationElement}.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Elements</em>' containment reference list.
    * @see notation.NotationPackage#getDiagram_Elements()
    * @model containment="true"
    * @generated
    */
   EList<NotationElement> getElements();

   /**
    * Returns the value of the '<em><b>Diagram Type</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Diagram Type</em>' attribute.
    * @see #setDiagramType(String)
    * @see notation.NotationPackage#getDiagram_DiagramType()
    * @model
    * @generated
    */
   String getDiagramType();

   /**
    * Sets the value of the '{@link notation.Diagram#getDiagramType <em>Diagram Type</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Diagram Type</em>' attribute.
    * @see #getDiagramType()
    * @generated
    */
   void setDiagramType(String value);

} // Diagram
