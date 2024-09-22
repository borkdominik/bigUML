/********************************************************************************
 * Copyright (c) 2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.representation.class_;

import org.eclipse.emf.common.util.Enumerator;

import com.borkdominik.big.glsp.server.core.features.direct_editing.implementations.BGEMFDefaultDirectEditHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.delete.implementations.BGEMFDefaultDeleteHandler;
import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultReconnectElementHandler;
import com.borkdominik.big.glsp.uml.uml.elements.abstraction.AbstractionElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.association.AssociationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.class_.ClassElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.data_type.DataTypeElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.dependency.DependencyElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.element_import.ElementImportElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.enumeration.EnumerationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.enumeration_literal.EnumerationLiteralElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.generalization.GeneralizationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.interface_.InterfaceElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.interface_realization.InterfaceRealizationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.operation.OperationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.package_.PackageElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.package_import.PackageImportElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.package_merge.PackageMergeElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.ParameterElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.primitive_type.PrimitiveTypeElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.property.PropertyElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.realization.RealizationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.substitution.SubstitutionElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.usage.UsageElementManifest;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public final class UMLClassManifest extends BGRepresentationManifest {

   @Override
   public Enumerator representation() {
      return Representation.CLASS;
   }

   @Override
   protected void configure() {
      super.configure();

      bindToolPalette(ClassToolPaletteProvider.class);
      bindDefaultDeleteOperation(BGEMFDefaultDeleteHandler.class);
      bindDefaultDirectEdit(BGEMFDefaultDirectEditHandler.class);
      bindDefaultReconnectOperation(UMLDefaultReconnectElementHandler.class);
      bindDefaultPropertyPalette(UMLDefaultPropertyPaletteProvider.class);

      install(new ClassElementManifest(this));
      install(new EnumerationElementManifest(this));
      install(new EnumerationLiteralElementManifest(this));
      install(new DataTypeElementManifest(this));
      install(new InterfaceElementManifest(this));
      install(new OperationElementManifest(this));
      install(new PackageElementManifest(this));
      install(new ParameterElementManifest(this));
      install(new PrimitiveTypeElementManifest(this));
      install(new PropertyElementManifest(this));

      install(new AbstractionElementManifest(this));
      install(new AssociationElementManifest(this));
      install(new DependencyElementManifest(this));
      install(new ElementImportElementManifest(this));
      install(new GeneralizationElementManifest(this));
      install(new InterfaceRealizationElementManifest(this));
      install(new PackageImportElementManifest(this));
      install(new PackageMergeElementManifest(this));
      install(new RealizationElementManifest(this));
      install(new SubstitutionElementManifest(this));
      install(new UsageElementManifest(this));
   }
}
