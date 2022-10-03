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

import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Shape</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link notation.Shape#getPosition <em>Position</em>}</li>
 *   <li>{@link notation.Shape#getSize <em>Size</em>}</li>
 * </ul>
 *
 * @see notation.NotationPackage#getShape()
 * @model
 * @generated
 */
public interface Shape extends NotationElement {
   /**
    * Returns the value of the '<em><b>Position</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Position</em>' containment reference.
    * @see #setPosition(GPoint)
    * @see notation.NotationPackage#getShape_Position()
    * @model containment="true"
    * @generated
    */
   GPoint getPosition();

   /**
    * Sets the value of the '{@link notation.Shape#getPosition <em>Position</em>}' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Position</em>' containment reference.
    * @see #getPosition()
    * @generated
    */
   void setPosition(GPoint value);

   /**
    * Returns the value of the '<em><b>Size</b></em>' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Size</em>' containment reference.
    * @see #setSize(GDimension)
    * @see notation.NotationPackage#getShape_Size()
    * @model containment="true"
    * @generated
    */
   GDimension getSize();

   /**
    * Sets the value of the '{@link notation.Shape#getSize <em>Size</em>}' containment reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Size</em>' containment reference.
    * @see #getSize()
    * @generated
    */
   void setSize(GDimension value);

} // Shape
