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

import org.eclipse.glsp.server.emf.model.notation.Diagram;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Uml Diagram</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link com.eclipsesource.uml.modelserver.unotation.UmlDiagram#getRepresentation <em>Representation</em>}</li>
 * </ul>
 *
 * @see com.eclipsesource.uml.modelserver.unotation.UnotationPackage#getUmlDiagram()
 * @model
 * @generated
 */
public interface UmlDiagram extends Diagram {
   /**
    * Returns the value of the '<em><b>Representation</b></em>' attribute.
    * The default value is <code>"CLASS"</code>.
    * The literals are from the enumeration {@link com.eclipsesource.uml.modelserver.unotation.Representation}.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Representation</em>' attribute.
    * @see com.eclipsesource.uml.modelserver.unotation.Representation
    * @see #setRepresentation(Representation)
    * @see com.eclipsesource.uml.modelserver.unotation.UnotationPackage#getUmlDiagram_Representation()
    * @model default="CLASS" required="true"
    * @generated
    */
   Representation getRepresentation();

   /**
    * Sets the value of the '{@link com.eclipsesource.uml.modelserver.unotation.UmlDiagram#getRepresentation <em>Representation</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Representation</em>' attribute.
    * @see com.eclipsesource.uml.modelserver.unotation.Representation
    * @see #getRepresentation()
    * @generated
    */
   void setRepresentation(Representation value);

} // UmlDiagram
