/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.artifact;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.borkdominik.big.glsp.uml.uml.elements.packageable_element.CreatePackagableElementCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ArtifactOperationHandler extends BGEMFNodeOperationHandler<Artifact, Element> {

   @Inject
   public ArtifactOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateSemanticCommand<Artifact> createSemanticCommand(
      final CreateNodeOperation operation,
      final Element parent) {

      if (parent instanceof Package p) {
         var argument = CreatePackagableElementCommand.Argument
            .<Artifact> createPackageableElementArgumentBuilder()
            .supplier((x) -> UMLFactory.eINSTANCE.createArtifact())
            .build();

         return new CreatePackagableElementCommand<>(commandContext, p, argument);
      }

      var argument = UMLCreateNodeCommand.Argument
         .<Artifact, Element> createChildArgumentBuilder()
         .supplier((x) -> {
            Artifact artifact;

            if (x instanceof Node n) {
               artifact = UMLFactory.eINSTANCE.createArtifact();
               n.getNestedClassifiers().add(artifact);
            } else if (x instanceof Artifact a) {
               artifact = a.createNestedArtifact(null);
            } else {
               throw new IllegalArgumentException(
                  String.format("Parent %s can not be handled", parent.getClass().getName()));
            }

            return artifact;
         })
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

}
