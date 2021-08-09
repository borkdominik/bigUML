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

import com.eclipsesource.uml.modelserver.unotation.Diagram;
import com.eclipsesource.uml.modelserver.unotation.NotationElement;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.eclipsesource.uml.modelserver.unotation.UnotationPackage;

import java.util.Collection;

import org.eclipse.emf.common.notify.Notification;
import org.eclipse.emf.common.notify.NotificationChain;

import org.eclipse.emf.common.util.EList;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.InternalEObject;

import org.eclipse.emf.ecore.impl.ENotificationImpl;

import org.eclipse.emf.ecore.util.EObjectContainmentEList;
import org.eclipse.emf.ecore.util.InternalEList;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Diagram</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link com.eclipsesource.uml.modelserver.unotation.impl.DiagramImpl#getElements <em>Elements</em>}</li>
 *   <li>{@link com.eclipsesource.uml.modelserver.unotation.impl.DiagramImpl#getDiagramType <em>Diagram Type</em>}</li>
 * </ul>
 *
 * @generated
 */
public class DiagramImpl extends NotationElementImpl implements Diagram {
   /**
    * The cached value of the '{@link #getElements() <em>Elements</em>}' containment reference list.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getElements()
    * @generated
    * @ordered
    */
   protected EList<NotationElement> elements;

   /**
    * The default value of the '{@link #getDiagramType() <em>Diagram Type</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getDiagramType()
    * @generated
    * @ordered
    */
   protected static final Representation DIAGRAM_TYPE_EDEFAULT = Representation.CLASS;

   /**
    * The cached value of the '{@link #getDiagramType() <em>Diagram Type</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getDiagramType()
    * @generated
    * @ordered
    */
   protected Representation diagramType = DIAGRAM_TYPE_EDEFAULT;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   protected DiagramImpl() {
      super();
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   protected EClass eStaticClass() {
      return UnotationPackage.Literals.DIAGRAM;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EList<NotationElement> getElements() {
      if (elements == null) {
         elements = new EObjectContainmentEList<NotationElement>(NotationElement.class, this, UnotationPackage.DIAGRAM__ELEMENTS);
      }
      return elements;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Representation getDiagramType() {
      return diagramType;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void setDiagramType(Representation newDiagramType) {
      Representation oldDiagramType = diagramType;
      diagramType = newDiagramType == null ? DIAGRAM_TYPE_EDEFAULT : newDiagramType;
      if (eNotificationRequired())
         eNotify(new ENotificationImpl(this, Notification.SET, UnotationPackage.DIAGRAM__DIAGRAM_TYPE, oldDiagramType, diagramType));
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public NotificationChain eInverseRemove(InternalEObject otherEnd, int featureID, NotificationChain msgs) {
      switch (featureID) {
         case UnotationPackage.DIAGRAM__ELEMENTS:
            return ((InternalEList<?>)getElements()).basicRemove(otherEnd, msgs);
      }
      return super.eInverseRemove(otherEnd, featureID, msgs);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Object eGet(int featureID, boolean resolve, boolean coreType) {
      switch (featureID) {
         case UnotationPackage.DIAGRAM__ELEMENTS:
            return getElements();
         case UnotationPackage.DIAGRAM__DIAGRAM_TYPE:
            return getDiagramType();
      }
      return super.eGet(featureID, resolve, coreType);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @SuppressWarnings("unchecked")
   @Override
   public void eSet(int featureID, Object newValue) {
      switch (featureID) {
         case UnotationPackage.DIAGRAM__ELEMENTS:
            getElements().clear();
            getElements().addAll((Collection<? extends NotationElement>)newValue);
            return;
         case UnotationPackage.DIAGRAM__DIAGRAM_TYPE:
            setDiagramType((Representation)newValue);
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
         case UnotationPackage.DIAGRAM__ELEMENTS:
            getElements().clear();
            return;
         case UnotationPackage.DIAGRAM__DIAGRAM_TYPE:
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
         case UnotationPackage.DIAGRAM__ELEMENTS:
            return elements != null && !elements.isEmpty();
         case UnotationPackage.DIAGRAM__DIAGRAM_TYPE:
            return diagramType != DIAGRAM_TYPE_EDEFAULT;
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

} //DiagramImpl
