/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.representation.class_;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.elements.abstraction.AbstractionDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.association.AssociationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.class_.ClassDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.data_type.DataTypeDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.dependency.DependencyDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.enumeration.EnumerationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.enumeration_literal.EnumerationLiteralDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.generalization.GeneralizationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.instance_specification.InstanceSpecificationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.interface_.InterfaceDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.interface_realization.InterfaceRealizationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.literal.LiteralDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.operation.OperationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.package_.PackageDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.package_import.PackageImportDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.package_merge.PackageMergeDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.parameter.ParameterDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.primitive_type.PrimitiveTypeDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.property.PropertyDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.realization.RealizationDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.slot.SlotDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.substitution.SubstitutionDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.usage.UsageDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public final class ClassManifest extends DiagramManifest {

   public ClassManifest() {
      super(Representation.CLASS);
   }

   @Override
   protected void configure() {
      super.configure();

      install(new AbstractionDefinitionModule(this));
      install(new AssociationDefinitionModule(this));
      install(new ClassDefinitionModule(this));
      install(new DataTypeDefinitionModule(this));
      install(new DependencyDefinitionModule(this));
      install(new EnumerationDefinitionModule(this));
      install(new EnumerationLiteralDefinitionModule(this));
      install(new GeneralizationDefinitionModule(this));
      install(new InterfaceDefinitionModule(this));
      install(new InterfaceRealizationDefinitionModule(this));
      install(new OperationDefinitionModule(this));
      install(new PackageDefinitionModule(this));
      install(new PackageImportDefinitionModule(this));
      install(new PackageMergeDefinitionModule(this));
      install(new ParameterDefinitionModule(this));
      install(new PrimitiveTypeDefinitionModule(this));
      install(new PropertyDefinitionModule(this));
      install(new RealizationDefinitionModule(this));
      install(new SubstitutionDefinitionModule(this));
      install(new UsageDefinitionModule(this));
      install(new InstanceSpecificationDefinitionModule(this));
      install(new LiteralDefinitionModule(this));
      install(new SlotDefinitionModule(this));
   }

}
