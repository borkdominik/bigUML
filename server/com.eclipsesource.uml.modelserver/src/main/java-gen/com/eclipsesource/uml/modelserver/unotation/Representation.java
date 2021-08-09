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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.eclipse.emf.common.util.Enumerator;

/**
 * <!-- begin-user-doc -->
 * A representation of the literals of the enumeration '<em><b>Representation</b></em>',
 * and utility methods for working with them.
 * <!-- end-user-doc -->
 * @see com.eclipsesource.uml.modelserver.unotation.UnotationPackage#getRepresentation()
 * @model
 * @generated
 */
public enum Representation implements Enumerator {
   /**
    * The '<em><b>ACTIVITY</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #ACTIVITY_VALUE
    * @generated
    * @ordered
    */
   ACTIVITY(0, "ACTIVITY", "ACTIVITY"),

   /**
    * The '<em><b>CLASS</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #CLASS_VALUE
    * @generated
    * @ordered
    */
   CLASS(1, "CLASS", "CLASS"),

   /**
    * The '<em><b>PACKAGE</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #PACKAGE_VALUE
    * @generated
    * @ordered
    */
   PACKAGE(2, "PACKAGE", "PACKAGE"),

   /**
    * The '<em><b>SEQUENCE</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #SEQUENCE_VALUE
    * @generated
    * @ordered
    */
   SEQUENCE(3, "SEQUENCE", "SEQUENCE"),

   /**
    * The '<em><b>STATEMACHINE</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #STATEMACHINE_VALUE
    * @generated
    * @ordered
    */
   STATEMACHINE(4, "STATEMACHINE", "STATEMACHINE"),

   /**
    * The '<em><b>USECASE</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #USECASE_VALUE
    * @generated
    * @ordered
    */
   USECASE(5, "USECASE", "USECASE"), /**
    * The '<em><b>DEPLOYMENT</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #DEPLOYMENT_VALUE
    * @generated
    * @ordered
    */
   DEPLOYMENT(6, "DEPLOYMENT", "DEPLOYMENT"), /**
    * The '<em><b>COMPONENT</b></em>' literal object.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #COMPONENT_VALUE
    * @generated
    * @ordered
    */
   COMPONENT(7, "COMPONENT", "COMPONENT");

   /**
    * The '<em><b>ACTIVITY</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #ACTIVITY
    * @model
    * @generated
    * @ordered
    */
   public static final int ACTIVITY_VALUE = 0;

   /**
    * The '<em><b>CLASS</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #CLASS
    * @model
    * @generated
    * @ordered
    */
   public static final int CLASS_VALUE = 1;

   /**
    * The '<em><b>PACKAGE</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #PACKAGE
    * @model
    * @generated
    * @ordered
    */
   public static final int PACKAGE_VALUE = 2;

   /**
    * The '<em><b>SEQUENCE</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #SEQUENCE
    * @model
    * @generated
    * @ordered
    */
   public static final int SEQUENCE_VALUE = 3;

   /**
    * The '<em><b>STATEMACHINE</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #STATEMACHINE
    * @model
    * @generated
    * @ordered
    */
   public static final int STATEMACHINE_VALUE = 4;

   /**
    * The '<em><b>USECASE</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #USECASE
    * @model
    * @generated
    * @ordered
    */
   public static final int USECASE_VALUE = 5;

   /**
    * The '<em><b>DEPLOYMENT</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #DEPLOYMENT
    * @model
    * @generated
    * @ordered
    */
   public static final int DEPLOYMENT_VALUE = 6;

   /**
    * The '<em><b>COMPONENT</b></em>' literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #COMPONENT
    * @model
    * @generated
    * @ordered
    */
   public static final int COMPONENT_VALUE = 7;

   /**
    * An array of all the '<em><b>Representation</b></em>' enumerators.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private static final Representation[] VALUES_ARRAY =
      new Representation[] {
         ACTIVITY,
         CLASS,
         PACKAGE,
         SEQUENCE,
         STATEMACHINE,
         USECASE,
         DEPLOYMENT,
         COMPONENT,
      };

   /**
    * A public read-only list of all the '<em><b>Representation</b></em>' enumerators.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   public static final List<Representation> VALUES = Collections.unmodifiableList(Arrays.asList(VALUES_ARRAY));

   /**
    * Returns the '<em><b>Representation</b></em>' literal with the specified literal value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param literal the literal.
    * @return the matching enumerator or <code>null</code>.
    * @generated
    */
   public static Representation get(String literal) {
      for (int i = 0; i < VALUES_ARRAY.length; ++i) {
         Representation result = VALUES_ARRAY[i];
         if (result.toString().equals(literal)) {
            return result;
         }
      }
      return null;
   }

   /**
    * Returns the '<em><b>Representation</b></em>' literal with the specified name.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param name the name.
    * @return the matching enumerator or <code>null</code>.
    * @generated
    */
   public static Representation getByName(String name) {
      for (int i = 0; i < VALUES_ARRAY.length; ++i) {
         Representation result = VALUES_ARRAY[i];
         if (result.getName().equals(name)) {
            return result;
         }
      }
      return null;
   }

   /**
    * Returns the '<em><b>Representation</b></em>' literal with the specified integer value.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the integer value.
    * @return the matching enumerator or <code>null</code>.
    * @generated
    */
   public static Representation get(int value) {
      switch (value) {
         case ACTIVITY_VALUE: return ACTIVITY;
         case CLASS_VALUE: return CLASS;
         case PACKAGE_VALUE: return PACKAGE;
         case SEQUENCE_VALUE: return SEQUENCE;
         case STATEMACHINE_VALUE: return STATEMACHINE;
         case USECASE_VALUE: return USECASE;
         case DEPLOYMENT_VALUE: return DEPLOYMENT;
         case COMPONENT_VALUE: return COMPONENT;
      }
      return null;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private final int value;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private final String name;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private final String literal;

   /**
    * Only this class can construct instances.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   private Representation(int value, String name, String literal) {
      this.value = value;
      this.name = name;
      this.literal = literal;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public int getValue() {
     return value;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public String getName() {
     return name;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public String getLiteral() {
     return literal;
   }

   /**
    * Returns the literal value of the enumerator, which is its string representation.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public String toString() {
      return literal;
   }
   
} //Representation
