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

import notation.NotationPackage;
import notation.SemanticElementReference;

import org.eclipse.emf.common.notify.Notification;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.InternalEObject;

import org.eclipse.emf.ecore.impl.ENotificationImpl;
import org.eclipse.emf.ecore.impl.MinimalEObjectImpl;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Semantic Element Reference</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link notation.impl.SemanticElementReferenceImpl#getElementId <em>Element Id</em>}</li>
 *   <li>{@link notation.impl.SemanticElementReferenceImpl#getResolvedSemanticElement <em>Resolved Semantic Element</em>}</li>
 * </ul>
 *
 * @generated
 */
public class SemanticElementReferenceImpl extends MinimalEObjectImpl.Container implements SemanticElementReference {
   /**
    * The default value of the '{@link #getElementId() <em>Element Id</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getElementId()
    * @generated
    * @ordered
    */
   protected static final String ELEMENT_ID_EDEFAULT = null;

   /**
    * The cached value of the '{@link #getElementId() <em>Element Id</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getElementId()
    * @generated
    * @ordered
    */
   protected String elementId = ELEMENT_ID_EDEFAULT;

   /**
    * The cached value of the '{@link #getResolvedSemanticElement() <em>Resolved Semantic Element</em>}' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getResolvedSemanticElement()
    * @generated
    * @ordered
    */
   protected EObject resolvedSemanticElement;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   protected SemanticElementReferenceImpl() {
      super();
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   protected EClass eStaticClass() {
      return NotationPackage.Literals.SEMANTIC_ELEMENT_REFERENCE;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public String getElementId() {
      return elementId;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void setElementId(String newElementId) {
      String oldElementId = elementId;
      elementId = newElementId;
      if (eNotificationRequired())
         eNotify(new ENotificationImpl(this, Notification.SET, NotationPackage.SEMANTIC_ELEMENT_REFERENCE__ELEMENT_ID, oldElementId, elementId));
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public EObject getResolvedSemanticElement() {
      if (resolvedSemanticElement != null && resolvedSemanticElement.eIsProxy()) {
         InternalEObject oldResolvedSemanticElement = (InternalEObject)resolvedSemanticElement;
         resolvedSemanticElement = eResolveProxy(oldResolvedSemanticElement);
         if (resolvedSemanticElement != oldResolvedSemanticElement) {
            if (eNotificationRequired())
               eNotify(new ENotificationImpl(this, Notification.RESOLVE, NotationPackage.SEMANTIC_ELEMENT_REFERENCE__RESOLVED_SEMANTIC_ELEMENT, oldResolvedSemanticElement, resolvedSemanticElement));
         }
      }
      return resolvedSemanticElement;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   public EObject basicGetResolvedSemanticElement() {
      return resolvedSemanticElement;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void setResolvedSemanticElement(EObject newResolvedSemanticElement) {
      EObject oldResolvedSemanticElement = resolvedSemanticElement;
      resolvedSemanticElement = newResolvedSemanticElement;
      if (eNotificationRequired())
         eNotify(new ENotificationImpl(this, Notification.SET, NotationPackage.SEMANTIC_ELEMENT_REFERENCE__RESOLVED_SEMANTIC_ELEMENT, oldResolvedSemanticElement, resolvedSemanticElement));
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Object eGet(int featureID, boolean resolve, boolean coreType) {
      switch (featureID) {
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__ELEMENT_ID:
            return getElementId();
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__RESOLVED_SEMANTIC_ELEMENT:
            if (resolve) return getResolvedSemanticElement();
            return basicGetResolvedSemanticElement();
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
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__ELEMENT_ID:
            setElementId((String)newValue);
            return;
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__RESOLVED_SEMANTIC_ELEMENT:
            setResolvedSemanticElement((EObject)newValue);
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
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__ELEMENT_ID:
            setElementId(ELEMENT_ID_EDEFAULT);
            return;
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__RESOLVED_SEMANTIC_ELEMENT:
            setResolvedSemanticElement((EObject)null);
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
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__ELEMENT_ID:
            return ELEMENT_ID_EDEFAULT == null ? elementId != null : !ELEMENT_ID_EDEFAULT.equals(elementId);
         case NotationPackage.SEMANTIC_ELEMENT_REFERENCE__RESOLVED_SEMANTIC_ELEMENT:
            return resolvedSemanticElement != null;
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
      result.append(" (elementId: ");
      result.append(elementId);
      result.append(')');
      return result.toString();
   }

} //SemanticElementReferenceImpl
