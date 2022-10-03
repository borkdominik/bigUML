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
package notation.impl;

import java.util.Collection;

import notation.Diagram;
import notation.NotationElement;
import notation.NotationPackage;

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
 *   <li>{@link notation.impl.DiagramImpl#getElements <em>Elements</em>}</li>
 *   <li>{@link notation.impl.DiagramImpl#getDiagramType <em>Diagram Type</em>}</li>
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
   protected static final String DIAGRAM_TYPE_EDEFAULT = null;

   /**
    * The cached value of the '{@link #getDiagramType() <em>Diagram Type</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getDiagramType()
    * @generated
    * @ordered
    */
   protected String diagramType = DIAGRAM_TYPE_EDEFAULT;

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
      return NotationPackage.Literals.DIAGRAM;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EList<NotationElement> getElements() {
      if (elements == null) {
         elements = new EObjectContainmentEList<NotationElement>(NotationElement.class, this, NotationPackage.DIAGRAM__ELEMENTS);
      }
      return elements;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public String getDiagramType() {
      return diagramType;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void setDiagramType(String newDiagramType) {
      String oldDiagramType = diagramType;
      diagramType = newDiagramType;
      if (eNotificationRequired())
         eNotify(new ENotificationImpl(this, Notification.SET, NotationPackage.DIAGRAM__DIAGRAM_TYPE, oldDiagramType, diagramType));
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public NotificationChain eInverseRemove(InternalEObject otherEnd, int featureID, NotificationChain msgs) {
      switch (featureID) {
         case NotationPackage.DIAGRAM__ELEMENTS:
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
         case NotationPackage.DIAGRAM__ELEMENTS:
            return getElements();
         case NotationPackage.DIAGRAM__DIAGRAM_TYPE:
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
         case NotationPackage.DIAGRAM__ELEMENTS:
            getElements().clear();
            getElements().addAll((Collection<? extends NotationElement>)newValue);
            return;
         case NotationPackage.DIAGRAM__DIAGRAM_TYPE:
            setDiagramType((String)newValue);
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
         case NotationPackage.DIAGRAM__ELEMENTS:
            getElements().clear();
            return;
         case NotationPackage.DIAGRAM__DIAGRAM_TYPE:
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
         case NotationPackage.DIAGRAM__ELEMENTS:
            return elements != null && !elements.isEmpty();
         case NotationPackage.DIAGRAM__DIAGRAM_TYPE:
            return DIAGRAM_TYPE_EDEFAULT == null ? diagramType != null : !DIAGRAM_TYPE_EDEFAULT.equals(diagramType);
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
