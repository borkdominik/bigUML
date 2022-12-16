package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;

import com.eclipsesource.uml.modelserver.shared.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlGraphUtil;

public class AddEnumerationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:add_enumeration";

   public static CCompoundCommand create(final GPoint position) {
      var command = CCommandFactory.eINSTANCE.createCompoundCommand();

      command.setType(TYPE);
      command.getProperties().put(NotationKeys.POSITION_X, String.valueOf(position.getX()));
      command.getProperties().put(NotationKeys.POSITION_Y, String.valueOf(position.getY()));

      return command;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var context = ModelContext.of(modelUri, domain);

      var position = UmlGraphUtil.getGPoint(
         command.getProperties().get(NotationKeys.POSITION_X),
         command.getProperties().get(NotationKeys.POSITION_Y));

      return new AddEnumerationCompoundCommand(context, position);
   }

}
