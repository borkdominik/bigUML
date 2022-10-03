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
package com.eclipsesource.uml.modelserver.unotation.impl;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;
import com.eclipsesource.uml.modelserver.unotation.UnotationPackage;

import notation.impl.DiagramImpl;

import org.eclipse.emf.common.notify.Notification;

import org.eclipse.emf.ecore.EClass;

import org.eclipse.emf.ecore.impl.ENotificationImpl;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Uml Diagram</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link com.eclipsesource.uml.modelserver.unotation.impl.UmlDiagramImpl#getRepresentation <em>Representation</em>}</li>
 * </ul>
 *
 * @generated
 */
public class UmlDiagramImpl extends DiagramImpl implements UmlDiagram {
   /**
    * The default value of the '{@link #getRepresentation() <em>Representation</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getRepresentation()
    * @generated
    * @ordered
    */
   protected static final Representation REPRESENTATION_EDEFAULT = Representation.CLASS;

   /**
    * The cached value of the '{@link #getRepresentation() <em>Representation</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getRepresentation()
    * @generated
    * @ordered
    */
   protected Representation representation = REPRESENTATION_EDEFAULT;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   protected UmlDiagramImpl() {
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

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Representation getRepresentation() {
      return representation;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void setRepresentation(Representation newRepresentation) {
      Representation oldRepresentation = representation;
      representation = newRepresentation == null ? REPRESENTATION_EDEFAULT : newRepresentation;
      if (eNotificationRequired())
         eNotify(new ENotificationImpl(this, Notification.SET, UnotationPackage.UML_DIAGRAM__REPRESENTATION, oldRepresentation, representation));
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Object eGet(int featureID, boolean resolve, boolean coreType) {
      switch (featureID) {
         case UnotationPackage.UML_DIAGRAM__REPRESENTATION:
            return getRepresentation();
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
         case UnotationPackage.UML_DIAGRAM__REPRESENTATION:
            setRepresentation((Representation)newValue);
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
         case UnotationPackage.UML_DIAGRAM__REPRESENTATION:
            setRepresentation(REPRESENTATION_EDEFAULT);
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
         case UnotationPackage.UML_DIAGRAM__REPRESENTATION:
            return representation != REPRESENTATION_EDEFAULT;
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
      result.append(" (representation: ");
      result.append(representation);
      result.append(')');
      return result.toString();
   }

} //UmlDiagramImpl
