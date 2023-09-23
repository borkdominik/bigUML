package com.eclipsesource.uml.modelserver.uml.elements.manifestation.commands;

import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Manifestation;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateManifestationSemanticCommand
   extends BaseCreateSemanticRelationCommand<Manifestation, Artifact, PackageableElement> {

   public CreateManifestationSemanticCommand(final ModelContext context,
      final Artifact source, final PackageableElement target) {
      super(context, source, target);
   }

   @Override
   protected Manifestation createSemanticElement(final Artifact source, final PackageableElement target) {
      return source.createManifestation(null, target);
   }

}
