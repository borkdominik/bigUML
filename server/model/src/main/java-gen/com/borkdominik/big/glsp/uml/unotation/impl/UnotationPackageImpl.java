/**
 * Copyright (c) 2024 borkdominik and others.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
package com.borkdominik.big.glsp.uml.unotation.impl;

import com.borkdominik.big.glsp.uml.unotation.Representation;
import com.borkdominik.big.glsp.uml.unotation.UMLDiagram;
import com.borkdominik.big.glsp.uml.unotation.UnotationFactory;
import com.borkdominik.big.glsp.uml.unotation.UnotationPackage;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EEnum;
import org.eclipse.emf.ecore.EPackage;

import org.eclipse.emf.ecore.impl.EPackageImpl;

import org.eclipse.glsp.graph.GraphPackage;

import org.eclipse.glsp.server.emf.model.notation.NotationPackage;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model <b>Package</b>.
 * <!-- end-user-doc -->
 * @generated
 */
public class UnotationPackageImpl extends EPackageImpl implements UnotationPackage {
	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass umlDiagramEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum representationEEnum = null;

	/**
	 * Creates an instance of the model <b>Package</b>, registered with
	 * {@link org.eclipse.emf.ecore.EPackage.Registry EPackage.Registry} by the package
	 * package URI value.
	 * <p>Note: the correct way to create the package is via the static
	 * factory method {@link #init init()}, which also performs
	 * initialization of the package, or returns the registered package,
	 * if one already exists.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.eclipse.emf.ecore.EPackage.Registry
	 * @see com.borkdominik.big.glsp.uml.unotation.UnotationPackage#eNS_URI
	 * @see #init()
	 * @generated
	 */
	private UnotationPackageImpl() {
		super(eNS_URI, UnotationFactory.eINSTANCE);
	}
	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private static boolean isInited = false;

	/**
	 * Creates, registers, and initializes the <b>Package</b> for this model, and for any others upon which it depends.
	 *
	 * <p>This method is used to initialize {@link UnotationPackage#eINSTANCE} when that field is accessed.
	 * Clients should not invoke it directly. Instead, they should simply access that field to obtain the package.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #eNS_URI
	 * @see #createPackageContents()
	 * @see #initializePackageContents()
	 * @generated
	 */
	public static UnotationPackage init() {
		if (isInited) return (UnotationPackage)EPackage.Registry.INSTANCE.getEPackage(UnotationPackage.eNS_URI);

		// Obtain or create and register package
		Object registeredUnotationPackage = EPackage.Registry.INSTANCE.get(eNS_URI);
		UnotationPackageImpl theUnotationPackage = registeredUnotationPackage instanceof UnotationPackageImpl ? (UnotationPackageImpl)registeredUnotationPackage : new UnotationPackageImpl();

		isInited = true;

		// Initialize simple dependencies
		GraphPackage.eINSTANCE.eClass();
		NotationPackage.eINSTANCE.eClass();

		// Create package meta-data objects
		theUnotationPackage.createPackageContents();

		// Initialize created meta-data
		theUnotationPackage.initializePackageContents();

		// Mark meta-data to indicate it can't be changed
		theUnotationPackage.freeze();

		// Update the registry and return the package
		EPackage.Registry.INSTANCE.put(UnotationPackage.eNS_URI, theUnotationPackage);
		return theUnotationPackage;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public EClass getUMLDiagram() {
		return umlDiagramEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public EEnum getRepresentation() {
		return representationEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public UnotationFactory getUnotationFactory() {
		return (UnotationFactory)getEFactoryInstance();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private boolean isCreated = false;

	/**
	 * Creates the meta-model objects for the package.  This method is
	 * guarded to have no affect on any invocation but its first.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void createPackageContents() {
		if (isCreated) return;
		isCreated = true;

		// Create classes and their features
		umlDiagramEClass = createEClass(UML_DIAGRAM);

		// Create enums
		representationEEnum = createEEnum(REPRESENTATION);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private boolean isInitialized = false;

	/**
	 * Complete the initialization of the package and its meta-model.  This
	 * method is guarded to have no affect on any invocation but its first.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void initializePackageContents() {
		if (isInitialized) return;
		isInitialized = true;

		// Initialize package
		setName(eNAME);
		setNsPrefix(eNS_PREFIX);
		setNsURI(eNS_URI);

		// Obtain other dependent packages
		NotationPackage theNotationPackage = (NotationPackage)EPackage.Registry.INSTANCE.getEPackage(NotationPackage.eNS_URI);

		// Create type parameters

		// Set bounds for type parameters

		// Add supertypes to classes
		umlDiagramEClass.getESuperTypes().add(theNotationPackage.getDiagram());

		// Initialize classes, features, and operations; add parameters
		initEClass(umlDiagramEClass, UMLDiagram.class, "UMLDiagram", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);

		// Initialize enums and add enum literals
		initEEnum(representationEEnum, Representation.class, "Representation");
		addEEnumLiteral(representationEEnum, Representation.ACTIVITY);
		addEEnumLiteral(representationEEnum, Representation.CLASS);
		addEEnumLiteral(representationEEnum, Representation.COMMUNICATION);
		addEEnumLiteral(representationEEnum, Representation.COMPONENT);
		addEEnumLiteral(representationEEnum, Representation.COMPOSITE);
		addEEnumLiteral(representationEEnum, Representation.DEPLOYMENT);
		addEEnumLiteral(representationEEnum, Representation.INTERACTION);
		addEEnumLiteral(representationEEnum, Representation.OBJECT);
		addEEnumLiteral(representationEEnum, Representation.PACKAGE);
		addEEnumLiteral(representationEEnum, Representation.PROFILE);
		addEEnumLiteral(representationEEnum, Representation.SEQUENCE);
		addEEnumLiteral(representationEEnum, Representation.STATE_MACHINE);
		addEEnumLiteral(representationEEnum, Representation.TIMING);
		addEEnumLiteral(representationEEnum, Representation.USE_CASE);
		addEEnumLiteral(representationEEnum, Representation.INFORMATION_FLOW);

		// Create resource
		createResource(eNS_URI);
	}

} //UnotationPackageImpl
